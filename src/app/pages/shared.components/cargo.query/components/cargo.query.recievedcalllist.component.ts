import {
    Component, ViewEncapsulation,
    OnInit, OnDestroy, ViewChild
} from '@angular/core';
import {
    ResponseModel, GlobalConstants, KeyValue,
    GlobalStateService, UtilityService
} from '../../../../shared';
import { Observable, Subscription } from 'rxjs/Rx';

import {
    CallCenterOnlyPageService,
    ExternalInputModel
} from '../../../callcenteronlypage/component';
import { Router, NavigationEnd } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { InvolvePartyModel, AffectedObjectsToView, AffectedObjectsService
} from '../../../shared.components';

@Component({
    selector: 'cargoquery-assignedcalls',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/cargo.query.recievedcallslist.view.html',
    providers: [AffectedObjectsService]
})
export class CargoQueryRecievedCallsListComponent implements OnInit {
    @ViewChild('childModalcallcenter') public childModalcallcenter: ModalDirective;

    allAssignedCalls: ExternalInputModel[] = [];
    currentIncidentId: number;
    protected _onRouteChange: Subscription;
    callId: number;
    callcenterload: boolean = false;
    public isArchive: boolean = false;
    awbs: KeyValue[] = [];
    affectedObjects: AffectedObjectsToView[];

    constructor(private callcenteronlypageservice: CallCenterOnlyPageService,
        private affectedObjectsService: AffectedObjectsService,
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

        //this.getAllCargoQueryCallsRecieved(this.currentIncidentId);
        this.getCargo();
        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('CallRecieved', (model: number) => this.getAllCargoQueryCallsRecieved(this.currentIncidentId));

        // SignalR Notification
        this.globalState.Subscribe('AssignedCargoEnquiryCreationResponse', (model: ExternalInputModel) => {
            // this.getAllCargoQueryCallsRecieved(model.IncidentId);
            const index: number = this.allAssignedCalls
                .findIndex((x: ExternalInputModel) => x.ExternalInputId === model.ExternalInputId);

            if (index > -1) {
                this.allAssignedCalls.splice(index, 1, model);
            } else {
                this.allAssignedCalls.unshift(model)
            }
        });
    }

    incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getAllCargoQueryCallsRecieved(this.currentIncidentId);
    }

    getAllCargoQueryCallsRecieved(incidentId): void {
        this.childModalcallcenter.hide();
        this.callcenterload = false;
        this.callcenteronlypageservice.GetCargoQueryCallsRecievedByIncident(incidentId)
            .subscribe((response: ResponseModel<ExternalInputModel>) => {
                this.allAssignedCalls = response.Records;
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

    getCargo(): void {
        this.affectedObjectsService.GetFilterByIncidentId(this.currentIncidentId)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedObjects = this.affectedObjectsService.FlattenAffactedObjects(response.Records[0]);
                for (const affectedObject of this.affectedObjects) {
                    this.awbs.push(new KeyValue(affectedObject.AWB, affectedObject.AffectedObjectId));
                }

                this.getAllCargoQueryCallsRecieved(this.currentIncidentId);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    getAWBS(AffectedObjectId): string {
        let Nm: string = "";
        Nm = this.awbs.find(x => x.Value == AffectedObjectId).Key;
        return Nm;
    }

}

