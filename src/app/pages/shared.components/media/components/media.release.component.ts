import { Component, ViewEncapsulation, OnDestroy, OnInit } from '@angular/core';
import { MediaModel } from './media.model';
import { UtilityService } from '../../../../shared/services';
import { Router } from '@angular/router';
import {
    GlobalStateService, KeyValue, GlobalConstants
} from '../../../../shared';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'media-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.release.view.html'
})
export class MediaReleaseComponent implements OnInit, OnDestroy {
    evtMediaRelease: MediaModel;
    initiatedDepartment: number;
    incidentId: number;
    isArchive: boolean = false;
    public isShowAddEditMediaRelease:boolean=true;
    private ngUnsubscribe: Subject<any> = new Subject<any>();
    
    /**
     *Creates an instance of MediaReleaseComponent.
     * @param {Router} _router
     * @param {GlobalStateService} globalState
     * @memberof MediaReleaseComponent
     */
    constructor(private _router: Router,
        private globalState: GlobalStateService) { }

    getNotification(evt: MediaModel) {
        this.evtMediaRelease = evt;
    }

    ngOnInit(): any {
        this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.initiatedDepartment = +UtilityService.GetFromSession("CurrentDepartmentId"); 
         
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard, 
            (model: KeyValue) => this.departmentChangeHandler(model));

        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.incidentId = +UtilityService.GetFromSession('ArchieveIncidentId');
            this.isArchive = true;
        }
        else {
            this.incidentId = +UtilityService.GetFromSession('CurrentIncidentId');
            this.isArchive = false;
        }
    }

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.initiatedDepartment = department.Value;
    }
}