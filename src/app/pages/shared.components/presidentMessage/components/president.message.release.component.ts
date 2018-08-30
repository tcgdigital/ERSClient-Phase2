import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { PresidentMessageModel } from './presidentMessage.model';
import { UtilityService } from '../../../../shared/services';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs/Rx';

@Component({
    selector: 'presidentMessage-release-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/president.message.release.view.html'
})
export class PresidentMessageReleaseComponent implements OnInit, OnDestroy {
    evtPresidentMessage: PresidentMessageModel;
    initiatedDepartment: number;
    incidentId: number;
    isArchive: boolean = false;
    protected _onRouteChange: Subscription;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     *Creates an instance of PresidentMessageReleaseComponent.
     * @param {Router} _router
     * @memberof PresidentMessageReleaseComponent
     */
    constructor(private _router: Router) { }

    ngOnInit(): any {
        this.incidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.initiatedDepartment = +UtilityService.GetFromSession('CurrentDepartmentId');
        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.isArchive = true;
            this.incidentId = +UtilityService.GetFromSession('ArchieveIncidentId');
        }
        else {
            this.isArchive = false;
            this.incidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        }
    }

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}