import { Component, ViewEncapsulation } from '@angular/core';
import { MediaModel } from './media.model';
import { UtilityService } from '../../../../shared/services';
import { Router, NavigationEnd } from '@angular/router';
import {Subscription } from 'rxjs/Rx';


@Component({
    selector: 'media-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.release.view.html'
})
export class MediaReleaseComponent {
    evtMediaRelease: MediaModel;
     initiatedDepartment: number;
    incidentId: number;
    isArchive: boolean = false;
    protected _onRouteChange: Subscription;
     
constructor(private _router: Router) { }

    getNotification(evt: MediaModel) {
        this.evtMediaRelease = evt;
    }

    ngOnInit(): any {
       // this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.initiatedDepartment = +UtilityService.GetFromSession("CurrentDepartmentId");
        this._onRouteChange = this._router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (event.url.indexOf("archivedashboard") > -1) {
                    this.isArchive = true;
                    this.incidentId = +UtilityService.GetFromSession("ArchieveIncidentId");
                }
                else {
                    this.isArchive = false;
                    this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
                }
            }
        });
    }
}