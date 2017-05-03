import {
    Component, ViewEncapsulation,
    OnInit, SimpleChange, OnDestroy
} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TAB_LINKS } from './archive.dashboard.tablinks';
import { ITabLinkInterface, GlobalStateService, UtilityService, KeyValue } from '../../shared';
import { IncidentService, IncidentModel } from '../incident';
import { DepartmentService, DepartmentModel } from '../masterdata/department'

@Component({
    selector: 'archive-dashboard',
    templateUrl: './archive.dashboard.view.html',
    styleUrls: ['./archive.dashboard.style.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class ArchiveDashboardComponent implements OnInit, OnDestroy {
    public tablinks: ITabLinkInterface[];
    private sub: any;
    archievedIncidentId: number;
    currentDepartmentId: number;
    currentIncident: KeyValue;
    currentDepartment: KeyValue;
    constructor(private router: ActivatedRoute, private incidentService: IncidentService,
        private departmentService: DepartmentService) { }

    public ngOnInit(): void {
        // this.sub = this.router.params.subscribe(params => {
        // this.archievedIncidentId = +params['incidentId'];});
        this.archievedIncidentId = +UtilityService.GetFromSession('ArchieveIncidentId');
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.tablinks = TAB_LINKS;

        this.GetIncidentAndDepartment();
    }

    public ngOnDestroy(): void { }

    public onViewIncidentClick($event): void {

    }

    private GetIncidentAndDepartment(): void {
        this.incidentService.Get(this.archievedIncidentId)
            .map((record: IncidentModel) => {
                this.currentIncident = new KeyValue(record.Description, record.IncidentId);
            })
            .flatMap(_ => this.departmentService.Get(this.currentDepartmentId))
            .subscribe((data: DepartmentModel) => {
                this.currentDepartment = new KeyValue(data.Description, data.DepartmentId);
            })
    }

    
}