import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

import {
    SideMenuService, KeyValue,
    ResponseModel, GlobalStateService
} from '../shared';
import { DepartmentService, DepartmentModel } from './masterdata';
import { IncidentService, IncidentModel } from './incident';
import { PAGES_MENU } from './pages.menu';
import { UtilityService } from '../shared/services';


@Component({
    selector: 'pages',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './pages.view.html',
    providers: []
})
export class PagesComponent implements OnInit {
    sideMenuState: boolean = false;
    departments: KeyValue[] = [];
    incidents: KeyValue[] = [];
    userName: string;
    lastLogin: Date;
    private sub: any;
    userId: number;

    /**
     * Creates an instance of PagesComponent.
     * @param {SideMenuService} sideMenuService
     * @param {IncidentService} incidentService
     * @param {DepartmentService} departmentService
     * @param {GlobalStateService} globalState
     * @param {ToastrService} toastrService
     * @param {ToastrConfig} toastrConfig
     * 
     * @memberOf PagesComponent
     */
    constructor(private sideMenuService: SideMenuService,
        private incidentService: IncidentService,
        private departmentService: DepartmentService,
        private globalState: GlobalStateService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) {
        toastrConfig.closeButton = true;
        toastrConfig.progressBar = true;
        toastrConfig.enableHtml = true;
    }

    ngOnInit(): void {
        this.sideMenuService.updateMenuByRoutes(<Routes>PAGES_MENU);
        this.getDepartments();
        this.getIncidents();
        this.userName = 'Sandip Ghosh';
        this.lastLogin = new Date();
    }

    // private loggedInhandler(storageData: StorageData): void {
    //     storageData.DepartmentId = this.departments[0].Value;
    //     storageData.IncidentId = this.incidents[0].Value;
    //     this.globalState.NotifyDataChanged('stoargeDataInitialization', storageData);

    // }

    public toggleSideMenu($event): void {
        this.sideMenuState = !this.sideMenuState;
    }

    public onContactClicked($event): void {
        this.toastrService.info('Contacts command has been clicked', 'Contact', this.toastrConfig);
        console.log('Contacts Clicked');
    }

    public onHelpClicked($event): void {
        this.toastrService.info('Help command has been clicked', 'Help', this.toastrConfig);
        console.log('Help Clicked');
    }

    public onLogoutClicked($event): void {
        console.log('Logout Clicked');
    }

    public onDepartmentChange(selectedDepartment: KeyValue): void {
        UtilityService.SetToSession({ 'CurrentDepartmentId': selectedDepartment.Value });
        this.globalState.NotifyDataChanged('departmentChange', selectedDepartment.Value);
    }

    public onIncidentChange(selectedIncident: KeyValue): void {
        UtilityService.SetToSession({ 'CurrentIncidentId': selectedIncident.Value });
        this.globalState.NotifyDataChanged('incidentChange', selectedIncident.Value);
    }

    private getDepartments(): void {
        this.departmentService.GetAll()
            .map((x: ResponseModel<DepartmentModel>) => x.Records.sort((a, b) => {
                if (a.DepartmentName < b.DepartmentName) return -1;
                if (a.DepartmentName > b.DepartmentName) return 1;
                return 0;
            })).subscribe((x: DepartmentModel[]) => {
                this.departments = x.map((y: DepartmentModel) => new KeyValue(y.DepartmentName, y.DepartmentId));
                console.log(this.departments);
                UtilityService.SetToSession({ 'CurrentDepartmentId': this.departments[0].Value });
            });
    }

    private getIncidents(): void {
        this.incidentService.GetAllActiveIncidents()
            .map((x: ResponseModel<IncidentModel>) => x.Records.sort((a, b) => {
                let dateA = new Date(a.SubmittedOn).getTime();
                let dateB = new Date(b.SubmittedOn).getTime();
                return dateA > dateB ? 1 : -1;
            })).subscribe((x: IncidentModel[]) => {
                this.incidents = x.map((y: IncidentModel) => new KeyValue(y.EmergencyName, y.IncidentId));
                console.log(this.incidents);
                UtilityService.SetToSession({ 'CurrentIncidentId': this.incidents[0].Value });
            });
    }
}