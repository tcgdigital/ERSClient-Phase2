import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { SideMenuService, KeyValue, ResponseModel, GlobalStateService } from '../shared';
import { DepartmentService, DepartmentModel } from './masterdata';
import { IncidentService, IncidentModel } from './incident';
import { PAGES_MENU } from './pages.menu';

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

    /**
     * Creates an instance of PagesComponent.
     * @param {SideMenuService} sideMenuService 
     * @param {IncidentService} incidentService 
     * @param {DepartmentService} departmentService 
     * 
     * @memberOf PagesComponent
     */
    constructor(private sideMenuService: SideMenuService,
        private incidentService: IncidentService,
        private departmentService: DepartmentService, private globalState : GlobalStateService) { }

    ngOnInit(): void {
        this.sideMenuService.updateMenuByRoutes(<Routes>PAGES_MENU);
        this.getDepartments();
        this.getIncidents();
    }

    public toggleSideMenu($event): void {
        this.sideMenuState = !this.sideMenuState;
    }

    public onContactClicked($event): void {
        console.log('Contacts Clicked');
    }

    public onHelpClicked($event): void {
        console.log('Help Clicked');
    }

    public onDepartmentChange(selectedDepartment: KeyValue): void {
       this.globalState.NotifyDataChanged('departmentChange', selectedDepartment.Value);
    }

    public onIncidentChange(selectedIncident: KeyValue): void {
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
            });
    }
}