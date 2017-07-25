import { Component, ViewEncapsulation } from '@angular/core';
import { MediaModel } from './media.model';
import { UtilityService } from '../../../../shared/services';


@Component({
    selector: 'media-approval',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.release.approval.view.html'
})
export class MediaReleaseApprovalComponent {
    initiatedDepartment: number;
    incidentId: number;

    ngOnInit(): any {
        this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.initiatedDepartment = +UtilityService.GetFromSession("CurrentDepartmentId");        
    }
}