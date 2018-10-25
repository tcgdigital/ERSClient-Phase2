import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { PresidentMessageWidgetModel } from './presidentMessage.widget.model';
import { PresidentMessageModel } from '../../shared.components';
import { PresidentMessageWidgetService } from './presidentMessage.widget.service';
import {
    DataExchangeService, GlobalStateService,
    TextAccordionModel, KeyValue, UtilityService, GlobalConstants
} from '../../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'presidentMessage-widget',
    templateUrl: './presidentMessage.widget.view.html',
    styleUrls: ['./presidentMessage.widget.style.scss']
})
export class PresidentMessageWidgetComponent implements OnInit, OnDestroy {
    @Input('initiatedDepartmentId') initiatedDepartmentId: number;
    @Input('currentIncidentId') incidentId: number;
    @ViewChild('childModalPresidentMsg') public childModal: ModalDirective;

    isHidden: boolean = true;
    currentDepartmentId: number;
    currentIncidentId: number;
    public isShow: boolean = true;
    public isShowViewAll: boolean = true;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;
    public downloadPresidentMessageAccessCode: string = 'DownloadPresidentMessage';
    presidentMessages: Observable<TextAccordionModel[]>;
    AllPresidentMessages: Observable<PresidentMessageWidgetModel[]>;
    downloadPath: string;
    public isShowDownload: boolean=true;

    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private presidentMessagewidgetService: PresidentMessageWidgetService,
        private dataExchange: DataExchangeService<PresidentMessageWidgetModel>,
        private globalState: GlobalStateService) { }

    public ngOnInit(): void {
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.initiatedDepartmentId;

        if (UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'PresidentMessageViewAll')) {
            this.getAllPresidentsMessages();
        }
        if (UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'PresidentMessage')) {
            this.getLatestPresidentsMessages(this.currentIncidentId);
        }

        this.downloadPath = GlobalConstants.EXTERNAL_URL + 'api/Report/GenerateMediareleaseReport/PresidentMessage/' + this.currentIncidentId + '/';
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChange,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange,
            (model: KeyValue) => this.departmentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.PresidentMessagePublished,
            (model) => this.onPresidentMessagePublish(model));

        // Signalr Notification
        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceivePresidentsMessageResponse.Key, (model: PresidentMessageWidgetModel) =>
                this.getLatestPresidentsMessages(this.currentIncidentId));
    }

    public ngOnDestroy(): void {
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChange);
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.PresidentMessagePublished);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    getLatestPresidentsMessages(incidentId: number): void {
        let data: PresidentMessageWidgetModel[] = [];

        this.presidentMessagewidgetService.GetAllPresidentMessageByIncident(incidentId)
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .flatMap((x) => x)
            .take(3)
            .subscribe((x) => {
                data.push(x);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            }, () => this.presidentMessages = Observable.of(data
                .map((x: PresidentMessageWidgetModel) =>
                    new TextAccordionModel(x.PresidentMessageType, x.PublishedOn,
                        this.downloadPath + x.PresidentsMessageId))));
    }

    getAllPresidentsMessages(callback?: Function): void {
        let data: PresidentMessageWidgetModel[] = [];
        
        this.presidentMessagewidgetService.GetAllPresidentMessageByIncident(this.currentIncidentId)
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .flatMap((x) => x)
            .subscribe((x) => {
                data.push(x);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            }, () => {
                this.AllPresidentMessages = Observable.of(data);
                if (callback) {
                    callback();
                }
            });
    }

    openPresidentMessages(): void {
        this.getAllPresidentsMessages(() => {
            this.childModal.show();
        });
    }

    hidePresidentMessages(): void {
        this.childModal.hide();
    }

    private onPresidentMessagePublish(presidentMessage: PresidentMessageModel): void {
        if (presidentMessage.IsPublished) {
            this.getLatestPresidentsMessages(this.currentIncidentId);
        }
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.downloadPath = GlobalConstants.EXTERNAL_URL + 'api/Report/GenerateMediareleaseReport/PresidentMessage/' + this.currentIncidentId + '/';

        if (UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'PresidentMessageViewAll')) {
            this.getAllPresidentsMessages();
        }
        if (UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'PresidentMessage')) {
            this.getLatestPresidentsMessages(this.currentIncidentId);
        }
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;

        if (UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'PresidentMessageViewAll')) {
            this.getAllPresidentsMessages();
        }
        if (UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'PresidentMessage')) {
            this.getLatestPresidentsMessages(this.currentIncidentId);
        }
    }
}