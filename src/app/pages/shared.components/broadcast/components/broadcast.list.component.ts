import {
    Component, OnInit, ViewEncapsulation,
    Input, OnDestroy
} from '@angular/core';
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
    @Input() initiatedDepartmentId: number;
    @Input() incidentId: number;

    broadcastMessages: BroadCastModel[] = new Array<BroadCastModel>();
    publishedBroadcastsLatest: BroadCastModel[] = new Array<BroadCastModel>();
    publishedBroadcastsAll: BroadCastModel[] = new Array<BroadCastModel>();

    currentIncidentId: number;
    currentDepartmentId: number;
    protected _onRouteChange: Subscription;
    isArchive: boolean = false;

    constructor(private broadCastService: BroadcastService,
        private dataExchange: DataExchangeService<BroadCastModel>,
        private globalState: GlobalStateService, private _router: Router) { }

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
        const broadcastModelToSend = Object.assign({}, broadcastModelUpdate);
        this.dataExchange.Publish('OnBroadcastUpdate', broadcastModelToSend);
    }

    ngOnInit(): void {
        this.initiatedDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.incidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.currentDepartmentId = this.initiatedDepartmentId;
        this.currentIncidentId = this.incidentId;
        this.isArchive = false;
        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.isArchive = true;
            this.currentIncidentId = +UtilityService.GetFromSession('ArchieveIncidentId');
        }
        else {
            this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        }
        this.getBroadCasts(this.currentDepartmentId, this.currentIncidentId);

        this.dataExchange.Subscribe('BroadcastModelUpdated', (model) => this.onBroadcastSuccess(model));
        this.dataExchange.Subscribe('BroadcastModelSaved', (model) => this.onBroadcastSuccess(model));
        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));

        // SignalR Notification
        this.globalState.Subscribe('ReceiveBroadcastCreationResponse', (model: BroadCastModel) => {
            // this.broadcastMessages.unshift(model);
            this.getBroadCasts(this.currentDepartmentId, this.currentIncidentId);
        });

        this.globalState.Subscribe('ReceiveBroadcastModificationResponse', (model: BroadCastModel) => {
            this.getBroadCasts(this.currentDepartmentId, this.currentIncidentId);
            // const index: number = this.broadcastMessages
            //     .findIndex((x) => x.BroadcastId === model.BroadcastId);
            // if (index >= 0) {
            //     this.broadcastMessages.splice(index, 1, model);
            // }
        });
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('BroadcastModelSaved');
        this.dataExchange.Unsubscribe('BroadcastModelUpdated');
        this.globalState.Unsubscribe('incidentChangefromDashboard');
        this.globalState.Unsubscribe('departmentChangeFromDashboard');
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getBroadCasts(this.currentDepartmentId, this.currentIncidentId);
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getBroadCasts(this.currentDepartmentId, this.currentIncidentId);
    }
}