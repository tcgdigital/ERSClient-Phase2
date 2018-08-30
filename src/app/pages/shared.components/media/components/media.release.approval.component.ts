import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { UtilityService } from '../../../../shared/services';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'media-approval',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.release.approval.view.html'
})
export class MediaReleaseApprovalComponent implements OnInit, OnDestroy {
    initiatedDepartment: number;
    incidentId: number;
    private ngUnsubscribe: Subject<any> = new Subject<any>();
    
    ngOnInit(): any {
        this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.initiatedDepartment = +UtilityService.GetFromSession("CurrentDepartmentId");        
    }

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}