import {
    Component, ViewEncapsulation,
    OnInit, OnDestroy, ViewChild
} from '@angular/core';
import {
    ResponseModel, KeyValue,
    GlobalStateService, UtilityService, GlobalConstants
} from '../../../../shared';
import { Subscription, Subject, Observable } from 'rxjs/Rx';

import {
    CallCenterOnlyPageService,
    ExternalInputModel
} from '../../../callcenteronlypage/component';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'passengerquery-assignedcalls',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.query.assignedcallslist.view.html'
})
export class MediaQueryAssignedCallsListComponent implements OnInit, OnDestroy {
    @ViewChild('childModalcallcenter') public childModalcallcenter: ModalDirective;

    allAssignedCalls: ExternalInputModel[] = [];
    currentIncidentId: number;
    protected _onRouteChange: Subscription;
    callId: number;
    callcenterload: boolean = false;
    public isArchive: boolean = false;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     *Creates an instance of MediaQueryAssignedCallsListComponent.
     * @param {CallCenterOnlyPageService} callcenteronlypageservice
     * @param {Router} _router
     * @param {GlobalStateService} globalState
     * @memberof MediaQueryAssignedCallsListComponent
     */
    constructor(private callcenteronlypageservice: CallCenterOnlyPageService,
        private _router: Router,
        private globalState: GlobalStateService) {
    }

    ngOnInit() {
        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.isArchive = true;
            this.currentIncidentId = +UtilityService.GetFromSession('ArchieveIncidentId');
        }
        else {
            this.isArchive = false;
            this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        }

        this.getAllMediaQueryCalls(this.currentIncidentId);

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.CallRecieved,
            (model: KeyValue) => this.getAllMediaQueryCalls(this.currentIncidentId));

        // SignalR Notification
        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveMediaEnquiryCreationResponse.Key, (model: ExternalInputModel) => {
                // this.getAllMediaQueryCalls(this.currentIncidentId);
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
        this.getAllMediaQueryCalls(this.currentIncidentId);
    }

    getAllMediaQueryCalls(incidentId): void {
        this.childModalcallcenter.hide();
        this.callcenterload = false;

        this.callcenteronlypageservice.GetMediaQueryCallsByIncident(incidentId)
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
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