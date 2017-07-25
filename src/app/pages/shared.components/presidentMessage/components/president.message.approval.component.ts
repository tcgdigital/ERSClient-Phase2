import { Component, ViewEncapsulation } from '@angular/core';
import { PresidentMessageModel } from './presidentMessage.model';
import { UtilityService } from '../../../../shared/services';
import { GlobalStateService, KeyValue } from '../../../../shared';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

@Component({
    selector: 'presidentMessage-approval-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/president.message.approval.view.html'
})
export class PresidentMessageApprovalComponent {

    evtPresidentMessage: PresidentMessageModel;
    initiatedDepartment: number;
    incidentId: number;
    isArchive: boolean = false;
    protected _onRouteChange: Subscription;
    public isShowAddPresidentMessage:boolean=true;

    constructor(private _router: Router,private globalState: GlobalStateService) { }

    getNotification(evt: PresidentMessageModel) {

    }

    ngOnInit(): any {
        this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.initiatedDepartment = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));

        if (this._router.url.indexOf("archivedashboard") > -1) {
            this.isArchive = true;
            this.incidentId = +UtilityService.GetFromSession("ArchieveIncidentId");
        }
        else {
            this.isArchive = false;
            this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        }

    }

    private departmentChangeHandler(department: KeyValue): void {
        this.initiatedDepartment = department.Value;
    }
}