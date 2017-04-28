import {
    Component, ViewEncapsulation,
    OnInit, SimpleChange, OnDestroy
} from '@angular/core';
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { TAB_LINKS } from './archive.dashboard.tablinks';
import { ITabLinkInterface, GlobalStateService, UtilityService, KeyValue } from '../../shared';
import { IncidentService } from '../incident';
import { DepartmentService } from '../masterdata/department'

@Component({
    selector: 'archive-dashboard',
    templateUrl: './archive.dashboard.view.html',
    styleUrls: ['./archive.dashboard.style.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class ArchiveDashboardComponent implements OnInit, OnDestroy {
    public tablinks: ITabLinkInterface[];
    private sub: any;
    archievedIncidentId : number;
    currentDepartmentId: number;
    currentIncident: KeyValue;
    currentDepartment: KeyValue;
    constructor( private router: ActivatedRoute,private incidentService: IncidentService,
    private departmentService: DepartmentService) { }

    public ngOnInit(): void { 
        // this.sub = this.router.params.subscribe(params => {
        // this.archievedIncidentId = +params['incidentId'];});
        this.archievedIncidentId = +UtilityService.GetFromSession('ArchieveIncidentId');
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.tablinks = TAB_LINKS;
        this.getIncident(this.archievedIncidentId);
        this.getDepartment(this.currentDepartmentId);
    }

    public ngOnDestroy(): void { }

    public onViewIncidentClick($event): void {

    }
    private getIncident(incidentId: number): void {
        this.incidentService.Get(incidentId)
            .subscribe((data) => {
                this.currentIncident = new KeyValue(data.Description, data.IncidentId);
            });
    }

     private getDepartment(departmentId: number): void {
        this.departmentService.Get(departmentId)
            .subscribe((data) => {
                this.currentDepartment = new KeyValue(data.Description, data.DepartmentId);
            });
    }
}