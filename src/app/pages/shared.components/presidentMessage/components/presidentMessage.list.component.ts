import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { PresidentMessageModel } from './presidentMessage.model';
import { PresidentMessageService } from './presidentMessage.service';
import { ResponseModel, DataExchangeService, GlobalStateService, KeyValue,UtilityService } from '../../../../shared';
import { Router, NavigationEnd } from '@angular/router';
import {Subscription } from 'rxjs/Rx';

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
        private globalState: GlobalStateService,private _router: Router) { }

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
        this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.initiatedDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.currentIncidentId = +this.incidentId;
        this.currentDepartmentId = +this.initiatedDepartmentId;
        this._onRouteChange = this._router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (event.url.indexOf("archivedashboard") > -1) {
                    this.isArchive = true;
                    this.currentIncidentId = +UtilityService.GetFromSession("ArchieveIncidentId");
                    this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
                }
                else {
                    this.isArchive = false;
                    this.currentIncidentId = +UtilityService.GetFromSession("CurrentIncidentId");
                    this.getPresidentMessages(this.currentDepartmentId, this.currentIncidentId);
                }
            }
        });

        this.dataExchange.Subscribe("PresidentMessageModelSaved", model => this.onPresidentMessageSuccess(model));
        this.dataExchange.Subscribe("PresidentMessageModelUpdated", model => this.onPresidentMessageSuccess(model));
        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));
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
        this.globalState.Unsubscribe('incidentChangefromDashboard');
        this.globalState.Unsubscribe('departmentChangeFromDashboard');
    }
}