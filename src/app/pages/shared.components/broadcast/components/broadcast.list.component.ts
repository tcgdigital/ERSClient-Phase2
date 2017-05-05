import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { BroadCastModel } from './broadcast.model';
import { BroadcastService } from './broadcast.service';
import {
    ResponseModel, DataExchangeService,
    GlobalStateService, KeyValue, UtilityService
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
    protected _onRouteChange: Subscription;
    isArchive: boolean = false;

    constructor(private broadCastService: BroadcastService,
        private dataExchange: DataExchangeService<BroadCastModel>, private globalState: GlobalStateService, private _router: Router) { }

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
        this.currentDepartmentId = +this.initiatedDepartmentId;
        this._onRouteChange = this._router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (event.url.indexOf("archivedashboard") > -1) {
                    this.isArchive = true;
                    this.currentIncidentId = +UtilityService.GetFromSession("ArchieveIncidentId");
                    this.getBroadCasts(this.currentDepartmentId, this.currentIncidentId);
                }
                else {
                    this.isArchive = false;
                    this.currentIncidentId = +UtilityService.GetFromSession("CurrentIncidentId");
                    this.getBroadCasts(this.currentDepartmentId, this.currentIncidentId);
                }
            }
        });
       // this.currentIncidentId = +this.incidentId;
       //  this.getBroadCasts(this.currentDepartmentId, this.currentIncidentId);
        this.dataExchange.Subscribe("BroadcastModelUpdated", model => this.onBroadcastSuccess(model));
        this.dataExchange.Subscribe("BroadcastModelSaved", model => this.onBroadcastSuccess(model));
        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
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
        this.globalState.Unsubscribe('incidentChangefromDashboard');
        this.globalState.Unsubscribe('departmentChange');
    }
}