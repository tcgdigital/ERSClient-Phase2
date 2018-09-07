import {
    Component, OnInit, ViewEncapsulation,
    Input, OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs/Rx';
import { BroadCastModel } from './broadcast.model';
import { BroadcastService } from './broadcast.service';
import {
    ResponseModel, DataExchangeService,
    GlobalStateService, KeyValue, UtilityService, 
    GlobalConstants
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
    public isShowAddEditBroadcast:boolean=true;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private broadCastService: BroadcastService,
        private dataExchange: DataExchangeService<BroadCastModel>,
        private globalState: GlobalStateService, private _router: Router) { }

    getBroadCasts(departmentId, incidentId): void {
        this.broadCastService.Query(departmentId, incidentId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<BroadCastModel>) => {
                this.broadcastMessages = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    onBroadcastSuccess(broadcast: BroadCastModel): void {
        this.getBroadCasts(this.currentDepartmentId, this.currentIncidentId);
    }

    UpdateBroadcast(broadcastModelUpdate: BroadCastModel): void {
        const broadcastModelToSend = Object.assign({}, broadcastModelUpdate);
        this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.OnBroadcastUpdate, broadcastModelToSend);
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

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.BroadcastModelUpdated, 
            (model: BroadCastModel) => this.onBroadcastSuccess(model));

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.BroadcastModelSaved, 
            (model: BroadCastModel) => this.onBroadcastSuccess(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard, 
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard, 
            (model: KeyValue) => this.departmentChangeHandler(model));

        // SignalR Notification
        this.globalState.Subscribe
        (GlobalConstants.NotificationConstant.ReceiveBroadcastCreationResponse.Key, (model: BroadCastModel) => {
            this.getBroadCasts(this.currentDepartmentId, this.currentIncidentId);
        });

        this.globalState.Subscribe
        (GlobalConstants.NotificationConstant.ReceiveBroadcastModificationResponse.Key, (model: BroadCastModel) => {
            this.getBroadCasts(this.currentDepartmentId, this.currentIncidentId);
        });
    }

    ngOnDestroy(): void {
        // this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.BroadcastModelSaved);
        // this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.BroadcastModelUpdated);
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard);
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
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