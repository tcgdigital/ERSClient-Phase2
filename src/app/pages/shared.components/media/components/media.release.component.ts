import { Component, ViewEncapsulation } from '@angular/core';
import { MediaModel } from './media.model';
import { UtilityService } from '../../../../shared/services';
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
    public isShowAddMediaRelease:boolean=true;
    
    constructor(private globalState: GlobalStateService) { }

    getNotification(evt: MediaModel) {
        this.evtMediaRelease = evt;
    }

    ngOnInit(): any {
        this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.initiatedDepartment = +UtilityService.GetFromSession("CurrentDepartmentId");  
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));
      
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.initiatedDepartment = department.Value;
    }
}