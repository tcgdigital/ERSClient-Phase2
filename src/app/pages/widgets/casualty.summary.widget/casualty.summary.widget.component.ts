import {
    Component, OnInit, OnDestroy, ViewEncapsulation,
    Input, SimpleChange
} from '@angular/core';
import { CasualtySummeryModel, CasualtyExchangeModel } from './casualty.summary.widget.model';
import { CasualtySummaryWidgetService } from './casualty.summary.widget.service';
import {
    GlobalStateService, GlobalConstants
} from '../../../shared';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'casualty-summary-widget',
    templateUrl: './casualty.summary.widget.view.html',
    encapsulation: ViewEncapsulation.None
})
export class CasualtySummaryWidgetComponent implements OnInit, OnDestroy {
    @Input('initiatedDepartmentId') initiatedDepartmentId: number;
    @Input('currentIncidentId') incidentId: number;

    public currentDepartmentId: number;
    public casualtySummery: CasualtySummeryModel;
    public isShow: boolean = true;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;
    public isShowInjured: boolean = true;
    public isShowDeceased: boolean = true;
    public isShowMissing: boolean = true;
    public isShowOthers: boolean = true;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private casualtySummaryWidgetService: CasualtySummaryWidgetService, private globalState: GlobalStateService) { }

    getCausaltyStatusSummery(incidentId): void {
        this.casualtySummery = new CasualtySummeryModel();

        this.casualtySummaryWidgetService.GetCasualtyCount(incidentId)
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((casualtySummeryObservable) => {
                this.casualtySummery = casualtySummeryObservable;
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    public ngOnInit(): void {
        this.currentDepartmentId = this.initiatedDepartmentId;
        this.getCausaltyStatusSummery(this.incidentId);
        this.globalState.Subscribe('AffectedPersonStatusChanged',
            (model) => this.affectedPeopleStatusChanged());

        // SignalR Notification
        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveCasualtyCountResponse.Key, (models: CasualtyExchangeModel[]) => {
                if (models !== undefined && models.length > 0) {
                    this.casualtySummery = new CasualtySummeryModel();
                    // Populate Uninjured PDA count
                    this.casualtySummery.uninjuredCount = models.some((x: CasualtyExchangeModel) => x.MedicalStatus === 'Uninjured') ?
                        models.find((x: CasualtyExchangeModel) => x.MedicalStatus === 'Uninjured').StatusCount : 0;

                    // Populate Injured PDA count
                    this.casualtySummery.injuredCount = models.some((x: CasualtyExchangeModel) => x.MedicalStatus === 'Injured') ?
                        models.find((x: CasualtyExchangeModel) => x.MedicalStatus === 'Injured').StatusCount : 0;

                    // Populate Missing PDA count
                    this.casualtySummery.missingCount = models.some((x: CasualtyExchangeModel) => x.MedicalStatus === 'Missing') ?
                        models.find((x: CasualtyExchangeModel) => x.MedicalStatus === 'Missing').StatusCount : 0;

                    // Populate Deceased PDA count
                    this.casualtySummery.deceasedCount = models.some((x: CasualtyExchangeModel) => x.MedicalStatus === 'Deceased') ?
                        models.find((x: CasualtyExchangeModel) => x.MedicalStatus === 'Deceased').StatusCount : 0;

                    // Populate Others PDA count
                    this.casualtySummery.othersCount = models.some((x: CasualtyExchangeModel) => x.MedicalStatus === 'Others') ?
                        models.find((x: CasualtyExchangeModel) => x.MedicalStatus === 'Others').StatusCount : 0;
                }
            });

        // SignalR Notification
        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveIncidentBorrowingCompletionResponse.Key, () => {
                this.getCausaltyStatusSummery(this.incidentId);
            });
    }

    affectedPeopleStatusChanged(): void {
        this.getCausaltyStatusSummery(this.incidentId);
    }

    public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        if (changes['incidentId'] !== undefined && (changes['incidentId'].currentValue !==
            changes['incidentId'].previousValue) &&
            changes['incidentId'].previousValue !== undefined) {
            this.getCausaltyStatusSummery(this.incidentId);
        }
    }

    ngOnDestroy() {
        //this.globalState.Unsubscribe('AffectedPersonStatusChanged');

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}