import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { PresidentMessageModel } from './presidentMessage.model';
import { PresidentMessageService } from './presidentMessage.service';
import { ResponseModel, DataExchangeService, GlobalStateService, KeyValue, UtilityService, GlobalConstants } from '../../../../shared';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

@Component({
    selector: 'presidentMessage-detail',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/presidentMessage.list.view.html'
})
export class PresidentMessageListComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: number;
    @Input() incidentId: number;

    PresidentsMessages: PresidentMessageModel[] = [];
    currentIncidentId: number;
    currentDepartmentId: number;
    isArchive: boolean = false;
    downloadPath: string;
    protected _onRouteChange: Subscription;

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

    getPresidentMessages(departmentId: number, incidentId: number): void {
        this.presidentMessageService.Query(departmentId, incidentId)
            .subscribe((response: ResponseModel<PresidentMessageModel>) => {
                this.PresidentsMessages = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    onPresidentMessageSuccess(presidentMessage: PresidentMessageModel): void {
        this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
    }

    UpdatePresidentMessage(presidentMessageModelUpdate: PresidentMessageModel): void {
        const presidentMessageModelToSend = Object.assign({}, presidentMessageModelUpdate);
        this.dataExchange.Publish('OnPresidentMessageUpdate', presidentMessageModelToSend);
    }

    public ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('PresidentMessageModelSaved');
        this.dataExchange.Unsubscribe('PresidentMessageModelUpdated');
        this.globalState.Unsubscribe('incidentChangefromDashboard');
        this.globalState.Unsubscribe('departmentChangeFromDashboard');
    }

    public ngOnInit(): void {
        this.incidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.initiatedDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.currentIncidentId = +this.incidentId;
        this.currentDepartmentId = +this.initiatedDepartmentId;
        this.downloadPath = GlobalConstants.EXTERNAL_URL + 'api/Report/GenerateMediareleaseReport/PresidentMessage/' + this.currentIncidentId + '/';
        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.isArchive = true;
            this.currentIncidentId = +UtilityService.GetFromSession('ArchieveIncidentId');
        }
        else {
            this.isArchive = false;
            this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        }

        this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
        this.dataExchange.Subscribe('PresidentMessageModelSaved', (model) => this.onPresidentMessageSuccess(model));
        this.dataExchange.Subscribe('PresidentMessageModelUpdated', (model) => this.onPresidentMessageSuccess(model));
        this.dataExchange.Subscribe('PresidentMessageApprovalUpdated', (model) => this.onPresidentMessageSuccess(model));
        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));

        // Signalr Notification
        this.globalState.Subscribe('ReceivePresidentsMessageCreatedResponse', (model: PresidentMessageModel) => {
            this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
        });

        this.globalState.Subscribe('ReceivePresidentsMessageUpdateResponse', (model: PresidentMessageModel) => {
            this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
        });

        this.globalState.Subscribe('ReceivePresidentsMessageApprovedResponse', (model: PresidentMessageModel) => {
            this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
        });

        this.globalState.Subscribe('ReceivePresidentsMessageRejectedResponse', (model: PresidentMessageModel) => {
            this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
        });
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.downloadPath = GlobalConstants.EXTERNAL_URL + 'api/Report/GenerateMediareleaseReport/PresidentMessage/' + this.currentIncidentId + '/';
        this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
    }
}