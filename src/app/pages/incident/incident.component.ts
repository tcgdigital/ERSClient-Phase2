import { Component, OnInit, ViewEncapsulation, ViewChild, SimpleChange } from '@angular/core';
import { IncidentModel } from '../incident';
import { GlobalConstants, UtilityService, GlobalStateService, KeyValue } from '../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'incident-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/incident.html'
})
export class IncidentComponent implements OnInit {
    public currentDepartment: number;
    public currentUserId: number;
    public isShowPage: boolean = true;
    public pagePermissionValidationMessage:string;
    constructor(private globalState: GlobalStateService) {
        this.currentDepartment = 0;
    }

    ngOnInit(): any {
        this.pagePermissionValidationMessage='you are not authorize to view this page. Please contact system administrator.';
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
        this.currentDepartment = +UtilityService.GetFromSession('CurrentDepartmentId');
    }

    public departmentChangeHandler(department: KeyValue): void {
        this.currentDepartment =department.Value;
    }

}