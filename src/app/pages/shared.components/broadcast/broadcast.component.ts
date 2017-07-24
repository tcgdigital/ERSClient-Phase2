import { Component, ViewEncapsulation } from '@angular/core';
import { BroadCastModel } from './components';
import { UtilityService } from '../../../shared/services';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import {
    ResponseModel, DataExchangeService,
    GlobalStateService, KeyValue, AuthModel, GlobalConstants
} from '../../../shared';
@Component({
    selector: 'broadcast-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/broadcast.view.html',
    styleUrls: ['./styles/broadcast.style.scss']
})
export class BroadcastComponent {
    evtBroadcast: BroadCastModel;
    initiatedDepartment: number;
    incidentId: number;
    protected _onRouteChange: Subscription;
    isArchive: boolean = false;
    //public currentDepartmentId:number=0;
    public isShowAddBroadcast: boolean = true;

    constructor(private _router: Router,private globalState: GlobalStateService) { }

    getNotification(evt: BroadCastModel) {
        this.evtBroadcast = evt;
    }

    ngOnInit(): any {
        this.initiatedDepartment = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.incidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.initiatedDepartment = +UtilityService.GetFromSession('CurrentDepartmentId');
        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.incidentId = +UtilityService.GetFromSession('ArchieveIncidentId');
            this.isArchive = true;
        }
        else {
            this.incidentId = +UtilityService.GetFromSession('CurrentIncidentId');
            this.isArchive = false;
        }
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));

    }

    departmentChangeHandler(department: KeyValue): void {
        this.initiatedDepartment = department.Value;
    }
}