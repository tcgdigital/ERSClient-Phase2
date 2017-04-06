import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Routes, ActivatedRoute } from '@angular/router';
import { SideMenuService, KeyValue, ResponseModel, GlobalStateService } from '../shared';
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
    private sub: any;
    userId: number;

    /**
     * Creates an instance of PagesComponent.
     * @param {SideMenuService} sideMenuService 
     * @param {IncidentService} incidentService 
     * @param {DepartmentService} departmentService 
     * 
     * @memberOf PagesComponent
     */
    constructor(private sideMenuService: SideMenuService, private route: ActivatedRoute,
        private incidentService: IncidentService,
        private departmentService: DepartmentService, private globalState: GlobalStateService) { }

    ngOnInit(): void {
        this.sideMenuService.updateMenuByRoutes(<Routes>PAGES_MENU);
        this.sub = this.route.params.subscribe(params => {
            this.userId = params['userId'];

        });
        this.getDepartments();
        this.getIncidents();       
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
        console.log('Contacts Clicked');
    }

    public onHelpClicked($event): void {
        console.log('Help Clicked');
    }

    public onDepartmentChange(selectedDepartment: KeyValue): void {
        UtilityService.SetToSession({"CurrentDepartmentId" : selectedDepartment.Value});
        this.globalState.NotifyDataChanged('departmentChange', selectedDepartment.Value);
    }

    public onIncidentChange(selectedIncident: KeyValue): void {
        UtilityService.SetToSession({"CurrentIncidentId" :  selectedIncident.Value});
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
                UtilityService.SetToSession({"CurrentDepartmentId" : this.departments[0].Value});
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
                UtilityService.SetToSession({"CurrentIncidentId" : this.incidents[0].Value});
            });
    }
}