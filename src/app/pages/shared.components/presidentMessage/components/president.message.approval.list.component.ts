import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { PresidentMessageModel } from './presidentMessage.model';
import { PresidentMessageService } from './presidentMessage.service';
import {
    ResponseModel, DataExchangeService,
    GlobalStateService, KeyValue, UtilityService, GlobalConstants
} from '../../../../shared';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs/Rx';

@Component({
    selector: 'presidentMessage-approval-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/president.message.approval.list.view.html'
})
export class PresidentMessageApprovalListComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: number;
    @Input() incidentId: number;

    PresidentsMessages: PresidentMessageModel[] = [];
    currentIncidentId: number;
    currentDepartmentId: number;
    isArchive: boolean = false;
    protected _onRouteChange: Subscription;
    public isShowEditPresidentMessagePending:boolean = true;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     * Creates an instance of PresidentMessageListComponent.
     * @param {PresidentMessageService} presidentMessageService
     * @param {DataExchangeService<PresidentMessageModel>} dataExchange
     * @param {GlobalStateService} globalState
     *
     * @memberOf PresidentMessageListComponent
     */
    constructor(private presidentMessageService: PresidentMessageService,
        private dataExchange: DataExchangeService<PresidentMessageModel>,
        private globalState: GlobalStateService, private _router: Router) { }

    getPresidentMessages(departmentId, incidentId): void {
        this.presidentMessageService.Query(departmentId, incidentId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<PresidentMessageModel>) => {
                this.PresidentsMessages = response.Records.filter((a) => a.PresidentMessageStatus === 'SentForApproval');
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    onPresidentMessageSuccess(presidentMessage: PresidentMessageModel): void {
        this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
    }

    UpdatePresidentMessage(presidentMessageModelUpdate: PresidentMessageModel): void {
        const presidentMessageModelToSend = Object.assign({}, presidentMessageModelUpdate)
        this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.OnPresidentMessageApprovalUpdate, presidentMessageModelToSend);
    }

    public ngOnInit(): void {
        this.incidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.initiatedDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.currentIncidentId = +this.incidentId;
        this.currentDepartmentId = +this.initiatedDepartmentId;
        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.isArchive = true;
            this.currentIncidentId = +UtilityService.GetFromSession('ArchieveIncidentId');
        }
        else {
            this.isArchive = false;
            this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        }
        this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.PresidentsMessageSentForApproval, 
            (model: PresidentMessageModel) => this.onPresidentMessageSuccess(model));

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.PresidentMessageApprovalUpdated, 
            (model: PresidentMessageModel) => this.onPresidentMessageSuccess(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard, 
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard, 
            (model: KeyValue) => this.departmentChangeHandler(model));

        // Signalr Notification
        this.globalState.Subscribe
        (GlobalConstants.NotificationConstant.ReceivePresidentsMessageSendForApprovalResponse.Key, (model: PresidentMessageModel) => {
            this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
        });

        this.globalState.Subscribe
        (GlobalConstants.NotificationConstant.ReceivePresidentsMessagePublishedResponse.Key, (model: PresidentMessageModel) => {
            this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
        });

        this.globalState.Subscribe
        (GlobalConstants.NotificationConstant.ReceivePresidentsMessageUpdateResponse.Key, (model: PresidentMessageModel) => {
            this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
        });
    }

    public ngOnDestroy(): void {
        //this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.PresidentMessageApprovalUpdated);
        //this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard);
        //this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
    }
}