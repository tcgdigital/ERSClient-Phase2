import { Component, ViewEncapsulation } from '@angular/core';
import { MediaModel } from './media.model';
import { UtilityService } from '../../../../shared/services';
import { Router, NavigationEnd } from '@angular/router';
import {
    ResponseModel, DataExchangeService,
    GlobalStateService, KeyValue
} from '../../../../shared';

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
    public isShowAddEditMediaRelease:boolean=true;
    
    constructor(private _router: Router,private globalState: GlobalStateService) { }

    getNotification(evt: MediaModel) {
        this.evtMediaRelease = evt;
    }

    ngOnInit(): any {
        this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.initiatedDepartment = +UtilityService.GetFromSession("CurrentDepartmentId");  
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));
        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.incidentId = +UtilityService.GetFromSession('ArchieveIncidentId');
            this.isArchive = true;
        }
        else {
            this.incidentId = +UtilityService.GetFromSession('CurrentIncidentId');
            this.isArchive = false;
        }
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.initiatedDepartment = department.Value;
    }
}