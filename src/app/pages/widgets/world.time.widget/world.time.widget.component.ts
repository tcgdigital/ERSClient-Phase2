import {
    Component, OnInit, ViewEncapsulation,
    AfterViewInit, ElementRef, Input
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UtilityService, GlobalStateService } from '../../../shared/services';
import { ITimeZone, KeyValue } from '../../../shared/models/base.model';
import { GlobalTimeZone } from '../../../shared/constants/timezone';
import { WorldTimeWidgetService } from './world.time.widget.service';

@Component({
    selector: 'world-time-widget',
    templateUrl: './world.time.widget.view.html',
    styleUrls: ['./world.time.widget.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WorldTimeWidgetComponent implements OnInit, AfterViewInit {
    @Input() Clock1TimeZoneOffset: string = '';
    @Input() Clock2TimeZoneOffset: string = '';
    @Input() Clock3TimeZoneOffset: string = '';

    public timeZones: ITimeZone[] = new Array<ITimeZone>();
    public currentTimezone: ITimeZone = null;

    private isOn: boolean = false;

    constructor(private elementRef: ElementRef,
        private worldTimeWidgetService: WorldTimeWidgetService,
        private globalState: GlobalStateService) {
    }

    public ngOnInit(): void {
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => {
            this.SetCrisisLocationClock(model.Value);
        });
    }

    public ngAfterViewInit(): void {
        this.SetCrisisLocationClock();

        const $currentElement = jQuery(this.elementRef.nativeElement);
        let self = this;
        let rightMergin = '';

        if (window.screen.availWidth >= 1200)
            rightMergin = '-133px';
        else if (window.screen.availWidth >= 992 && window.screen.availWidth <= 1199)
            rightMergin = '-133px';
        else if (window.screen.availWidth >= 768 && window.screen.availWidth <= 991)
            rightMergin = '-133px';
        else if (window.screen.availWidth >= 576 && window.screen.availWidth <= 767)
            rightMergin = '-133px';
        else if (window.screen.availWidth >= 425 && window.screen.availWidth <= 575)
            rightMergin = '-133px';
        else if (window.screen.availWidth >= 375 && window.screen.availWidth <= 424)
            rightMergin = '-133px';
        else if (window.screen.availWidth >= 321 && window.screen.availWidth <= 374)
            rightMergin = '-133px';
        else if (window.screen.availWidth <= 320)
            rightMergin = '-133px';

        $currentElement.find('.world-clock-opner').click(function () {
            if (!self.isOn) {
                $currentElement.find('.world-clock-container').animate({
                    right: rightMergin
                }, 500, () => {
                    self.isOn = !self.isOn;
                });
            } else {
                $currentElement.find('.world-clock-container').animate({
                    right: 0
                }, 500, () => {
                    self.isOn = !self.isOn;
                });
            }
        });

        $currentElement.find('#clock_2').empty().jClocksGMT(
            {
                offset: '0',
                skin: 3
            });

        $currentElement.find('#clock_3').empty().jClocksGMT(
            {
                title: ' Manila, Philippines',
                offset: '8',
                skin: 3
            });
    }

    public OnZoneChange($event): void {
        const $currentElement = jQuery(this.elementRef.nativeElement);
        const $selectedElement = jQuery($event.target);
        $currentElement.find('#clock_1')
            .empty().jClocksGMT(
            {
                title: $selectedElement.find('option:selected').data('location'),
                offset: $selectedElement.find('option:selected').val(),
                skin: 3
            });
    }

    private SetCrisisLocationClock(incidentId: number = 0): void {
        const observables: Array<Observable<any>> = new Array<Observable<any>>();
        observables.push(this.worldTimeWidgetService.GetEmergencyLications());

        if (incidentId == 0 && UtilityService.IsSessionKeyExists('CurrentIncidentId')
            && UtilityService.GetFromSession('CurrentIncidentId'))
            incidentId = +UtilityService.GetFromSession('CurrentIncidentId');

        if (incidentId > 0)
            observables.push(this.worldTimeWidgetService.GetEmergencyLicationByIncidentId(incidentId));

        Observable.forkJoin(observables).subscribe((res) => {
            this.timeZones = res[0] as ITimeZone[];
            this.currentTimezone = res[1] as ITimeZone;

            jQuery(this.elementRef.nativeElement)
                .find('#clock_1').empty().jClocksGMT(
                {
                    title: `${(res[1] as ITimeZone).city}, ${(res[1] as ITimeZone).country}`,
                    offset: (res[1] as ITimeZone).decimaloffset,
                    skin: 3
                });
        });
    }
}