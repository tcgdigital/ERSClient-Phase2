import {
    Component, ViewEncapsulation,
    OnInit, OnDestroy, ViewChild
} from '@angular/core';
import {
    ResponseModel, KeyValue, GlobalStateService, UtilityService, GlobalConstants
} from '../../../../shared';
import { Subscription, Subject, Observable } from 'rxjs/Rx';

import {
    CallCenterOnlyPageService,
    ExternalInputModel
} from '../../../callcenteronlypage/component';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {
    InvolvePartyModel, AffectedObjectsToView, AffectedObjectsService
} from '../../../shared.components';

@Component({
    selector: 'cargoquery-assignedcalls',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/cargo.query.recievedcallslist.view.html',
    providers: [AffectedObjectsService]
})
export class CargoQueryRecievedCallsListComponent implements OnInit, OnDestroy {
    @ViewChild('childModalcallcenter') public childModalcallcenter: ModalDirective;

    allAssignedCalls: ExternalInputModel[] = [];
    currentIncidentId: number;
    callId: number;
    callcenterload: boolean = false;
    public isArchive: boolean = false;
    awbs: KeyValue[] = [];
    affectedObjects: AffectedObjectsToView[];
    private ngUnsubscribe: Subject<any> = new Subject<any>();

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
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.CallRecieved,
            (model: number) => this.getAllCargoQueryCallsRecieved(this.currentIncidentId));

        // SignalR Notification
        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.AssignedCargoEnquiryCreationResponse.Key, (model: ExternalInputModel) => {
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

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getAllCargoQueryCallsRecieved(this.currentIncidentId);
    }

    getAllCargoQueryCallsRecieved(incidentId): void {
        this.childModalcallcenter.hide();
        this.callcenterload = false;
        this.callcenteronlypageservice.GetCargoQueryCallsRecievedByIncident(incidentId)
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

    getCargo(): void {
        this.affectedObjectsService.GetFilterByIncidentId(this.currentIncidentId)
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedObjects = this.affectedObjectsService.FlattenAffactedObjects(response.Records[0]);
                for (const affectedObject of this.affectedObjects) {
                    this.awbs.push(new KeyValue(affectedObject.AWB, affectedObject.AffectedObjectId));
                }

                this.getAllCargoQueryCallsRecieved(this.currentIncidentId);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    getAWBS(affectedObjectId: number): string {
        if (affectedObjectId != null && affectedObjectId != undefined) {
            let Nm: string = "";
            Nm = this.awbs.find(x => x.Value == affectedObjectId).Key;
            return Nm;
        } else {
            return '';
        }
    }
}

