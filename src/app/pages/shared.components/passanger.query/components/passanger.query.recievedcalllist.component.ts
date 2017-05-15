import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import {
    ResponseModel, GlobalConstants, KeyValue,
    GlobalStateService, UtilityService
} from '../../../../shared';
import { CallCenterOnlyPageService, ExternalInputModel } from "../../../callcenteronlypage/component";
import { Observable, Subscription } from 'rxjs/Rx';
import { Router, NavigationEnd } from '@angular/router';



@Component({
    selector: 'passengerquery-recievedcalls',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/passanger.query.recievedcallslist.view.html'
})
export class PassangerQueryRecievedCallsListComponent {
    allAssignedCalls: ExternalInputModel[] = [];
    currentIncidentId: number;
    protected _onRouteChange: Subscription;
    callId: number;
    constructor(private callcenteronlypageservice: CallCenterOnlyPageService, private _router: Router,
        private globalState: GlobalStateService) {

    }

    ngOnInit() {
        this._onRouteChange = this._router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (event.url.indexOf("archivedashboard") > -1) {
                    // this.isArchive = true;
                    this.currentIncidentId = +UtilityService.GetFromSession("ArchieveIncidentId");
                    this.getAllPassengerQueryCallsRecieved(this.currentIncidentId);
                }
                else {
                    // this.isArchive = false;
                    this.currentIncidentId = +UtilityService.GetFromSession("CurrentIncidentId");
                    this.getAllPassengerQueryCallsRecieved(this.currentIncidentId);
                }
            }
        });

        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('CallRecieved', (model: KeyValue) => this.getAllPassengerQueryCallsRecieved(this.currentIncidentId));

    }

    incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getAllPassengerQueryCallsRecieved(this.currentIncidentId);
    }

    getAllPassengerQueryCallsRecieved(incidentId): void {
        this.callcenteronlypageservice.GetPassengerQueryCallsRecievedByIncident(incidentId)
            .subscribe((response: ResponseModel<ExternalInputModel>) => {
                this.allAssignedCalls = response.Records;
            });
    }


}