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
import { InvolvePartyService } from '../../involveparties';
import {
    InvolvePartyModel,
    AffectedPeopleService, AffectedPeopleToView
} from '../../../shared.components';

@Component({
    selector: 'crewquery-assignedcalls',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/crew.query.recievedcallslist.view.html',
    providers: [InvolvePartyService, AffectedPeopleService]
})
export class CrewQueryRecievedCallsListComponent implements OnInit, OnDestroy {
    @ViewChild('childModalcallcenter') public childModalcallcenter: ModalDirective;

    allAssignedCalls: ExternalInputModel[] = [];
    currentIncidentId: number;
    protected _onRouteChange: Subscription;
    callId: number;
    callcenterload: boolean = false;
    public isArchive: boolean = false;
    affectedPeople: AffectedPeopleToView[];
    crews: KeyValue[] = [];
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     *Creates an instance of CrewQueryRecievedCallsListComponent.
     * @param {CallCenterOnlyPageService} callcenteronlypageservice
     * @param {InvolvePartyService} involvedPartyService
     * @param {AffectedPeopleService} affectedPeopleService
     * @param {Router} _router
     * @param {GlobalStateService} globalState
     * @memberof CrewQueryRecievedCallsListComponent
     */
    constructor(private callcenteronlypageservice: CallCenterOnlyPageService,
        private involvedPartyService: InvolvePartyService,
        private affectedPeopleService: AffectedPeopleService,
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

        // this.getAllCrewQueryCallsRecieved(this.currentIncidentId);
        this.getPassengersCrews();
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.CallRecieved,
            (model: number) => this.getAllCrewQueryCallsRecieved(this.currentIncidentId));

        // SignalR Notification
        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.AssignedCrewEnquiryCreationResponse.Key, (model: ExternalInputModel) => {
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
        this.getAllCrewQueryCallsRecieved(this.currentIncidentId);
    }

    getAllCrewQueryCallsRecieved(incidentId): void {
        this.childModalcallcenter.hide();
        this.callcenterload = false;
        this.callcenteronlypageservice.GetCrewQueryCallsRecievedByIncident(incidentId)
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
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

    getPassengersCrews(): void {
        this.involvedPartyService.GetFilterByIncidentId(this.currentIncidentId)
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedPeople = this.affectedPeopleService.FlattenAffectedPeople(response.Records[0]);
                const crewModels = this.affectedPeople.filter(x => x.IsCrew == true);

                for (const affectedPerson of crewModels) {
                    this.crews.push(new KeyValue((affectedPerson.PassengerName || affectedPerson.CrewName), affectedPerson.AffectedPersonId));
                }
                this.getAllCrewQueryCallsRecieved(this.currentIncidentId);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    getCrewName(AffectedPersonId): string {
        let Nm: string = "";
        Nm = this.crews.find(x => x.Value == AffectedPersonId).Key;
        return Nm;
    }
}

