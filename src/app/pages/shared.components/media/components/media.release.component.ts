import { Component, ViewEncapsulation } from '@angular/core';
import { MediaModel } from './media.model';
import { UtilityService } from '../../../../shared/services';


@Component({
    selector: 'media-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.release.view.html'
})
export class MediaReleaseComponent {
    evtMediaRelease: MediaModel;
     initiatedDepartment: number;
    incidentId: number;

    getNotification(evt: MediaModel) {
        this.evtMediaRelease = evt;
    }

    ngOnInit(): any {
        this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.initiatedDepartment = +UtilityService.GetFromSession("CurrentDepartmentId");
    }
}