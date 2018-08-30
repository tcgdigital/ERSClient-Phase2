import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { PresidentMessageModel } from './presidentMessage.model';
import { UtilityService } from '../../../../shared/services';
import { GlobalStateService, KeyValue, GlobalConstants } from '../../../../shared';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs/Rx';

@Component({
    selector: 'presidentMessage-approval-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/president.message.approval.view.html'
})
export class PresidentMessageApprovalComponent implements OnInit, OnDestroy {
    evtPresidentMessage: PresidentMessageModel;
    initiatedDepartment: number;
    incidentId: number;
    isArchive: boolean = false;
    protected _onRouteChange: Subscription;
    public isShowAddPresidentMessage:boolean = true;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     *Creates an instance of PresidentMessageApprovalComponent.
     * @param {Router} _router
     * @param {GlobalStateService} globalState
     * @memberof PresidentMessageApprovalComponent
     */
    constructor(private _router: Router,
        private globalState: GlobalStateService) { }

    getNotification(evt: PresidentMessageModel) {
    }

    ngOnInit(): any {
        this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.initiatedDepartment = +UtilityService.GetFromSession("CurrentDepartmentId");
        
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard, 
            (model: KeyValue) => this.departmentChangeHandler(model));

        if (this._router.url.indexOf("archivedashboard") > -1) {
            this.isArchive = true;
            this.incidentId = +UtilityService.GetFromSession("ArchieveIncidentId");
        }
        else {
            this.isArchive = false;
            this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        }
    }

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.initiatedDepartment = department.Value;
    }
}