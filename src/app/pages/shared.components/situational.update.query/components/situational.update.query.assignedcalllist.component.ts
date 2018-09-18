import {
    Component, ViewEncapsulation,
    OnInit, OnDestroy, ViewChild
} from '@angular/core';
import {
    ResponseModel, KeyValue, GlobalStateService, UtilityService, GlobalConstants
} from '../../../../shared';
import { Subscription, Subject } from 'rxjs/Rx';

import {
    CallCenterOnlyPageService,
    ExternalInputModel
} from '../../../callcenteronlypage/component';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'passengerquery-assignedcalls',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/situational.update.query.assignedcallslist.view.html'
})
export class SituationalUpdateQueryAssignedCallsListComponent implements OnInit, OnDestroy {
    @ViewChild('childModalcallcenter') public childModalcallcenter: ModalDirective;

    allAssignedCalls: ExternalInputModel[] = [];
    currentIncidentId: number;
    protected _onRouteChange: Subscription;
    callId: number;
    callcenterload: boolean = false;
    public isArchive: boolean = false;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     *Creates an instance of SituationalUpdateQueryAssignedCallsListComponent.
     * @param {CallCenterOnlyPageService} callcenteronlypageservice
     * @param {Router} _router
     * @param {GlobalStateService} globalState
     * @memberof SituationalUpdateQueryAssignedCallsListComponent
     */
    constructor(private callcenteronlypageservice: CallCenterOnlyPageService,
        private _router: Router,
        private globalState: GlobalStateService) {
    }

    ngOnInit(): any {
        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.isArchive = true;
            this.currentIncidentId = +UtilityService.GetFromSession('ArchieveIncidentId');
        }
        else {
            this.isArchive = false;
            this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        }

        this.getAllSituationalUpdatesCalls(this.currentIncidentId);
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard, 
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.CallRecieved, 
            (model: number) => this.getAllSituationalUpdatesCalls(this.currentIncidentId));

        // SignalR Notification
        this.globalState.Subscribe
        (GlobalConstants.NotificationConstant.ReceiveSituationalUpdatesEnquiryCreationResponse.Key, (model: ExternalInputModel) => {
            // this.getAllSituationalUpdatesCalls(model.IncidentId);
            const index: number = this.allAssignedCalls
                .findIndex((x: ExternalInputModel) => x.ExternalInputId === model.ExternalInputId);

            if (index > -1) {
                this.allAssignedCalls.splice(index, 1, model);
            } else {
                this.allAssignedCalls.unshift(model)
            }
        });
    }

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getAllSituationalUpdatesCalls(this.currentIncidentId);
    }

    getAllSituationalUpdatesCalls(incidentId): void {
        this.childModalcallcenter.hide();
        this.callcenterload = false;
        this.callcenteronlypageservice.GetSituationalUpdatesCallsByIncident(incidentId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<ExternalInputModel>) => {
                this.allAssignedCalls = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    openCallcenter(externalInputId): void {
        this.callId = externalInputId;
        this.callcenterload = true;
        this.childModalcallcenter.show();
    }

    cancelCallcenter(): void {
        this.callcenterload = false;
        this.childModalcallcenter.hide();
    }
}