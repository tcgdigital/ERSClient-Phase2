import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { PresidentMessageModel } from './presidentMessage.model';
import { PresidentMessageService } from './presidentMessage.service';
import { ResponseModel, DataExchangeService, GlobalStateService, KeyValue } from '../../../../shared';

@Component({
    selector: 'presidentMessage-detail',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/presidentMessage.list.view.html'
})
export class PresidentMessageListComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: string;
    @Input() incidentId: string;

    PresidentsMessages: PresidentMessageModel[] = [];
    currentIncidentId: number;
    currentDepartmentId: number;

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
        private globalState: GlobalStateService) { }

    getPresidentMessages(departmentId, incidentId): void {
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
        let presidentMessageModelToSend = Object.assign({}, presidentMessageModelUpdate)
        this.dataExchange.Publish("OnPresidentMessageUpdate", presidentMessageModelToSend);
    }

    public ngOnInit(): void {
        this.currentIncidentId = +this.incidentId;
        this.currentDepartmentId = +this.initiatedDepartmentId;
        this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);

        this.dataExchange.Subscribe("PresidentMessageModelSaved", model => this.onPresidentMessageSuccess(model));
        this.dataExchange.Subscribe("PresidentMessageModelUpdated", model => this.onPresidentMessageSuccess(model));
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
    }

    public ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('PresidentMessageModelSaved');
        this.dataExchange.Unsubscribe('PresidentMessageModelUpdated');
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }
}