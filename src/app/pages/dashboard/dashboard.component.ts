import {
    Component, ViewEncapsulation,
    OnInit, SimpleChange
} from '@angular/core';
import { TAB_LINKS } from './dashboard.tablink';
import { ITabLinkInterface, GlobalStateService, UtilityService } from '../../shared';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.view.html',
    styleUrls: ['./dashboard.style.scss'],
    encapsulation: ViewEncapsulation.None,

})
export class DashboardComponent implements OnInit {
    public incidentDate: Date;
    public tablinks: ITabLinkInterface[];
    currentIncidentId: number;
    currentDepartmentId: number;
    currentUserId: number;
    private sub: any;
    userId: number;


    constructor(private globalState: GlobalStateService) {
        this.incidentDate = new Date('apr,10,2017,00:00:00');
    }

    public ngOnInit(): void {
        this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.tablinks = TAB_LINKS;
        this.globalState.Subscribe('incidentChange', (model) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model) => this.departmentChangeHandler(model));
    }

    private incidentChangeHandler(incidentId): void {
        this.currentIncidentId = incidentId;
    }

    private departmentChangeHandler(departmentId): void {
        this.currentDepartmentId = departmentId;
    }
}