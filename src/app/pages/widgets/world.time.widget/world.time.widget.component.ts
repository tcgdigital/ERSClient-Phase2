import {
    Component, OnInit, ViewEncapsulation,
    AfterViewInit, ElementRef, OnDestroy,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UtilityService, GlobalStateService } from '../../../shared/services';
import { IncidentModel, IncidentService } from '../../incident/components';
import { ITimeZone, KeyValue } from '../../../shared/models/base.model';
import { WorldTimeWidgetService } from './world.time.widget.service';
import { ResponseModel } from '../../../shared/models/response.model';
import { GlobalConstants } from '../../../shared';
import { Subject } from 'rxjs';

@Component({
    selector: 'world-time-widget',
    templateUrl: './world.time.widget.view.html',
    styleUrls: ['./world.time.widget.style.scss'],
    exportAs: 'worldclock',
    encapsulation: ViewEncapsulation.None
})
export class WorldTimeWidgetComponent implements OnInit, AfterViewInit, OnDestroy {
    public timeZones: ITimeZone[] = new Array<ITimeZone>();
    public currentTimezone: ITimeZone = null;
    private isOn: boolean = false;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private elementRef: ElementRef,
        private worldTimeWidgetService: WorldTimeWidgetService,
        private incidentService: IncidentService,
        private globalState: GlobalStateService) {
    }

    public ngOnInit(): void {
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChange, (model: KeyValue) => {
            this.SetCrisisLocationClock(model.Value);
        });

        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveCrisisClosureResponse.Key, (model) => {
                // this.CheckOpnedIncidentIfAny();
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public ngAfterViewInit(): void {
        this.SetCrisisLocationClock();

        if (/Android/i.test(navigator.userAgent)) {
            jQuery('.world-clock-opner').css('left', '-80px');
        } else {
            jQuery('.world-clock-opner').css('left', '-86px');
        }

        const $currentElement = jQuery(this.elementRef.nativeElement);
        let self = this;
        let rightMergin = '-135px';

        $currentElement.find('.world-clock-opner').click(function () {
            if (!self.isOn) {
                $currentElement.find('.world-clock-container').animate({
                    right: 0
                }, 500, () => {
                    self.isOn = !self.isOn;
                });
            } else {
                $currentElement.find('.world-clock-container').animate({
                    right: rightMergin
                }, 500, () => {
                    self.isOn = !self.isOn;
                });
            }
        });

        $currentElement.find('#gmt_clock').empty().jClocksGMT(
            {
                offset: '0',
                date: true,
                dateformat: 'DD-MM-YY',
                timeformat: 'HH:mm',
                skin: 3
            });

        $currentElement.find('#manila_clock').empty().jClocksGMT(
            {
                title: ' Manila, Philippines',
                offset: '8',
                date: true,
                dateformat: 'DD-MM-YY',
                timeformat: 'HH:mm',
                skin: 3
            });
    }

    public OnZoneChange($event): void {
        const $currentElement = jQuery(this.elementRef.nativeElement);
        const $selectedElement = jQuery($event.target);
        $currentElement.find('#incident_clock')
            .empty().jClocksGMT(
                {
                    title: $selectedElement.find('option:selected').data('location'),
                    offset: $selectedElement.find('option:selected').val(),
                    date: true,
                    dst: true,
                    dateformat: 'DD-MM-YY',
                    timeformat: 'HH:mm',
                    skin: 3
                });
    }

    public SetCrisisLocationClock(incidentId: number = 0): void {
        const observables: Array<Observable<any>> = new Array<Observable<any>>();
        observables.push(this.worldTimeWidgetService.GetEmergencyLications());

        if (incidentId == 0 && UtilityService.IsSessionKeyExists('CurrentIncidentId')
            && UtilityService.GetFromSession('CurrentIncidentId'))
            incidentId = +UtilityService.GetFromSession('CurrentIncidentId');

        if (incidentId > 0)
            observables.push(this.worldTimeWidgetService.GetEmergencyLicationByIncidentId(incidentId));

        Observable.forkJoin(observables)
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((res) => {
                this.timeZones = res[0] as ITimeZone[];
                this.currentTimezone = res[1] as ITimeZone;

                if (this.currentTimezone != undefined) {
                    jQuery(this.elementRef.nativeElement)
                        .find('#incident_clock').empty().jClocksGMT(
                            {
                                title: `${this.currentTimezone.city}, ${this.currentTimezone.country}`,
                                offset: this.currentTimezone.decimaloffset,
                                date: true,
                                dst: true,
                                dateformat: 'DD-MM-YY',
                                timeformat: 'HH:mm',
                                skin: 3
                            });
                }
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    private CheckOpnedIncidentIfAny() {
        const observables: Array<Observable<any>> = new Array<Observable<any>>();
        observables.push(this.incidentService.IsAnyOpenIncidents());
        observables.push(this.incidentService.GetOpenIncidents());

        Observable.forkJoin(observables)
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((res) => {
                const isAnyIncidentOpen: boolean = res[0] as boolean;
                const openIncidents: Array<IncidentModel> = (res[1] as ResponseModel<IncidentModel>).Records;

                if (isAnyIncidentOpen != undefined && isAnyIncidentOpen == true
                    && openIncidents != undefined && openIncidents.length > 0) {
                    this.SetCrisisLocationClock(openIncidents[0].IncidentId);
                } else {
                    this.currentTimezone = null;
                }
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }
}