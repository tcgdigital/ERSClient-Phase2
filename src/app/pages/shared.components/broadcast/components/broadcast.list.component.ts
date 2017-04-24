import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { BroadCastModel } from './broadcast.model';
import { BroadcastService } from './broadcast.service';
import {
    ResponseModel, DataExchangeService,
    GlobalStateService, KeyValue
} from '../../../../shared';

@Component({
    selector: 'broadcast-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/broadcast.list.view.html'
})
export class BroadcastListComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: string;
    @Input() incidentId: string;

    broadcastMessages: BroadCastModel[] = [];
    publishedBroadcastsLatest: BroadCastModel[] = [];
    publishedBroadcastsAll: BroadCastModel[] = [];
    currentIncidentId: number;
    currentDepartmentId: number;

    constructor(private broadCastService: BroadcastService,
        private dataExchange: DataExchangeService<BroadCastModel>, private globalState: GlobalStateService) { }

    getBroadCasts(departmentId, incidentId): void {
        this.broadCastService.Query(departmentId, incidentId)
            .subscribe((response: ResponseModel<BroadCastModel>) => {
                this.broadcastMessages = response.Records;
            });
    }

    onBroadcastSuccess(broadcast: BroadCastModel): void {
        this.getBroadCasts(this.currentDepartmentId, this.currentIncidentId);
    }

    UpdateBroadcast(broadcastModelUpdate: BroadCastModel): void {
        let broadcastModelToSend = Object.assign({}, broadcastModelUpdate)
        this.dataExchange.Publish("OnBroadcastUpdate", broadcastModelToSend);
    }

    ngOnInit(): void {
        this.currentIncidentId = +this.incidentId;
        this.currentDepartmentId = +this.initiatedDepartmentId;
        this.getBroadCasts(this.currentDepartmentId, this.currentIncidentId);

        this.dataExchange.Subscribe("BroadcastModelUpdated", model => this.onBroadcastSuccess(model));
        this.dataExchange.Subscribe("BroadcastModelSaved", model => this.onBroadcastSuccess(model));
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getBroadCasts(this.currentDepartmentId, this.currentIncidentId);
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getBroadCasts(this.currentDepartmentId, this.currentIncidentId);
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("BroadcastModelSaved");
        this.dataExchange.Unsubscribe("BroadcastModelUpdated");
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }
}