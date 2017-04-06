import {
    Component, ViewEncapsulation,
    OnInit, SimpleChange
} from '@angular/core';
import { TAB_LINKS } from './dashboard.tablink';
import { ITabLinkInterface , GlobalStateService  } from '../../shared';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.view.html',
    styleUrls: ['./dashboard.style.scss'],
    encapsulation: ViewEncapsulation.None,

})
export class DashboardComponent implements OnInit {
    public incidentDate: Date;
    public tablinks: ITabLinkInterface[];
    currentIncidentId : number;
    currentDepartmentId : number;
    currentUserId : number;
    private sub: any;
    userId: number;

    constructor(private globalState : GlobalStateService) {
        this.incidentDate = new Date(2017, 3, 24, 1, 20, 25);
    }

    public ngOnInit(): void {
        this.tablinks = TAB_LINKS;        
    }

    // private initializationHandler(storageDate : StorageData) : void{
    //         this.currentDepartmentId = storageDate.DepartmentId;
    //         this.currentIncidentId = storageDate.IncidentId;
    //         this.currentUserId = storageDate.UserId;
    // }
}