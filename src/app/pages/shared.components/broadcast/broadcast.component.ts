import { Component, ViewEncapsulation } from '@angular/core';
import { BroadCastModel } from './components';
import { UtilityService } from '../../../shared/services';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';



@Component({
    selector: 'broadcast-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/broadcast.view.html',
    styleUrls: ['./styles/broadcast.style.scss']
})
export class BroadcastComponent {
    evtBroadcast: BroadCastModel;
    initiatedDepartment: number;
    incidentId: number;
    protected _onRouteChange: Subscription;
    isArchive: boolean = false;


    constructor(private _router: Router) { }
    getNotification(evt: BroadCastModel) {
        this.evtBroadcast = evt;
    }
    ngOnInit(): any {
        this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.initiatedDepartment = +UtilityService.GetFromSession("CurrentDepartmentId");
        this._onRouteChange = this._router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (event.url.indexOf("archivedashboard") > -1) {
                    this.incidentId = +UtilityService.GetFromSession("ArchieveIncidentId");
                    this.isArchive = true;
                }
                else {
                    this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
                    this.isArchive = false;
                }
            }
        });
    }
}