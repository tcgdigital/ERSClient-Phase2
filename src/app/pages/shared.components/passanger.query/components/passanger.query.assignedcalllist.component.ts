import { Component, ViewEncapsulation, OnInit, OnDestroy,ViewChild } from '@angular/core';
import {
    ResponseModel, GlobalConstants, KeyValue,
    GlobalStateService, UtilityService
} from '../../../../shared';
import { Observable, Subscription } from 'rxjs/Rx';

import { CallCenterOnlyPageService, ExternalInputModel } from "../../../callcenteronlypage/component";
import { Router, NavigationEnd } from '@angular/router';
import { ModalDirective } from 'ng2-bootstrap/modal';



@Component({
    selector: 'passengerquery-assignedcalls',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/passenger.query.assignedcallslist.view.html'
})
export class PassangerQueryAssignedCallsListComponent implements OnInit {
   @ViewChild('childModalcallcenter') public childModalcallcenter: ModalDirective;

    allAssignedCalls: ExternalInputModel[] = [];
    currentIncidentId: number;
    protected _onRouteChange: Subscription;
    callId : number;
    constructor(private callcenteronlypageservice: CallCenterOnlyPageService, private _router: Router,
     private globalState: GlobalStateService) {

    }

    ngOnInit() {
        this._onRouteChange = this._router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (event.url.indexOf("archivedashboard") > -1) {
                    // this.isArchive = true;
                    this.currentIncidentId = +UtilityService.GetFromSession("ArchieveIncidentId");
                    this.getAllPassengerQueryCalls(this.currentIncidentId);
                }
                else {
                    // this.isArchive = false;
                    this.currentIncidentId = +UtilityService.GetFromSession("CurrentIncidentId");
                    this.getAllPassengerQueryCalls(this.currentIncidentId);
                }
            }
        });

        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('CallRecieved', (model: KeyValue) => this.getAllPassengerQueryCalls(this.currentIncidentId));

    }

    incidentChangeHandler(incident : KeyValue) : void{
          this.currentIncidentId = incident.Value;
          this.getAllPassengerQueryCalls(this.currentIncidentId);
    }

    getAllPassengerQueryCalls(incidentId): void {
        this.callcenteronlypageservice.GetPassengerQueryCallsByIncident(incidentId)
            .subscribe((response : ResponseModel<ExternalInputModel>)=>{
                this.allAssignedCalls = response.Records;
            });
    }

    openCallcenter(externalInputId) : void{
        this.callId = externalInputId;
        this.childModalcallcenter.show();
    }

    cancelCallcenter() : void{
        this.childModalcallcenter.hide();
    }
}