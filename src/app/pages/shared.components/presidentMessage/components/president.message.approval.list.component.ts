import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { PresidentMessageModel } from './presidentMessage.model';
import { PresidentMessageService } from './presidentMessage.service';
import {
    ResponseModel, DataExchangeService,
    GlobalStateService, KeyValue, UtilityService
} from '../../../../shared';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

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
    public isShowEditPresidentMessagePending:boolean=true;

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
            .subscribe((response: ResponseModel<PresidentMessageModel>) => {
                this.PresidentsMessages = response.Records.filter((a) => a.PresidentMessageStatus === 'SentForApproval');
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    onPresidentMessageSuccess(presidentMessage: PresidentMessageModel): void {
        this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
    }

    UpdatePresidentMessage(presidentMessageModelUpdate: PresidentMessageModel): void {
        const presidentMessageModelToSend = Object.assign({}, presidentMessageModelUpdate)
        this.dataExchange.Publish('OnPresidentMessageApprovalUpdate', presidentMessageModelToSend);
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
        this.dataExchange.Subscribe('PresidentsMessageSentForApproval', (model) => this.onPresidentMessageSuccess(model));
        this.dataExchange.Subscribe('PresidentMessageApprovalUpdated', (model) => this.onPresidentMessageSuccess(model));
        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));

        // Signalr Notification
        this.globalState.Subscribe('ReceivePresidentsMessageSendForApprovalResponse', (model: PresidentMessageModel) => {
            this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
        });

        this.globalState.Subscribe('ReceivePresidentsMessagePublishedResponse', (model: PresidentMessageModel) => {
            this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
        });

        this.globalState.Subscribe('ReceivePresidentsMessageUpdateResponse', (model: PresidentMessageModel) => {
            this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
        });
    }

    public ngOnDestroy(): void {
        //this.dataExchange.Unsubscribe('PresidentMessageApprovalUpdated');
        //this.globalState.Unsubscribe('incidentChangefromDashboard');
        //this.globalState.Unsubscribe('departmentChangeFromDashboard');
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