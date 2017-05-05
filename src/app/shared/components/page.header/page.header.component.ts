import {
    Component, ViewEncapsulation, SimpleChange,
    Output, Input, EventEmitter, AfterContentInit, OnChanges
} from '@angular/core';
import { GlobalStateService } from '../../services';
import { KeyValue } from '../../models';
import { Router } from '@angular/router';
import { AuthenticationService } from "../../../pages/login/components/authentication.service";

@Component({
    selector: '[page-header]',
    templateUrl: './page.header.view.html',
    encapsulation: ViewEncapsulation.None
})
export class PageHeaderComponent implements AfterContentInit {
    @Input() userName: string;
    @Input() lastLogin: Date;
    @Input() departments: KeyValue[];
    @Input() incidents: KeyValue[];
    @Input() currentDepartmentId: number = 0;
    @Input() currentIncidentId: number = 0;

    @Output() toggleSideMenu: EventEmitter<any> = new EventEmitter<any>();
    @Output() contactClicked: EventEmitter<any> = new EventEmitter<any>();
    @Output() helpClicked: EventEmitter<any> = new EventEmitter<any>();
    @Output() logoutClicked: EventEmitter<any> = new EventEmitter<any>();

    @Output() departmentChange: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();
    @Output() incidentChange: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();

    constructor(private router: Router, private authenticationService: AuthenticationService) {
    }

    public ngAfterContentInit(): void {
        // console.log(`page header currentDepartmentId: ${this.currentDepartmentId}`);
        // console.log(`page header currentIncidentId: ${this.currentIncidentId}`);
    }

    public onToggleSideMenu($event): void {
        this.toggleSideMenu.emit($event);
    }

    public onContactClicked($event): void {
        this.contactClicked.emit($event);
    }

    public onHelpClicked($event): void {
        this.helpClicked.emit($event);
    }

    public onLogoutClicked($event): void {
        this.logoutClicked.emit($event);
        this.authenticationService.Logout();
        this.router.navigate(['login']);
        //sessionStorage.clear();
    }

    public onDepartmentChange(selectedDepartment: KeyValue): void {
        this.departmentChange.emit(selectedDepartment);
    }

    public onIncidentChange(selectedIncident: KeyValue): void {
        this.incidentChange.emit(selectedIncident);
    }
}