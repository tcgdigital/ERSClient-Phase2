import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ExternalInputModel, CallCenterOnlyPageService } from '../../../callcenteronlypage';
import { Subject, Observable } from 'rxjs';
import { UtilityService, GlobalStateService, GlobalConstants, KeyValue, ResponseModel } from '../../../../shared';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'ground-victim-query-assigned-calls',
    templateUrl: '../views/ground.victim.query.assigned.calls.view.html'
})

export class GroundVictimQueryAssignedCallsComponent implements OnInit, OnDestroy {
    @ViewChild(ModalDirective) public childModalcallcenter: ModalDirective;

    public allAssignedCalls: ExternalInputModel[] = [];
    public currentIncidentId: number;
    public isArchive: boolean = false;

    // protected _onRouteChange: Subscription;
    private callId: number;
    private callcenterload: boolean = false;

    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private callcenteronlypageservice: CallCenterOnlyPageService,
        private _router: Router,
        private globalState: GlobalStateService) { }

    public ngOnInit(): void {
        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.isArchive = true;
            this.currentIncidentId = +UtilityService.GetFromSession('ArchieveIncidentId');
        }
        else {
            this.isArchive = false;
            this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        }

        this.getAllGroundVictimQueryCalls(this.currentIncidentId);

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.CallRecieved,
            (model: number) => this.getAllGroundVictimQueryCalls(this.currentIncidentId));

        // SignalR Notification
        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.AssignedGroundVictimEnquiryCreationResponse.Key,
            (model: ExternalInputModel) => {
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

    public openCallcenter(externalInputId: number): void {
        this.callId = externalInputId;
        this.callcenterload = true;
        this.childModalcallcenter.show();
    }

    public cancelCallcenter(): void {
        this.callcenterload = false;
        this.childModalcallcenter.hide();
    }

    private getAllGroundVictimQueryCalls(incidentId: number): void {
        this.childModalcallcenter.hide();
        this.callcenterload = false;

        this.callcenteronlypageservice.GetGroundVictimCallsByIncident(incidentId)
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<ExternalInputModel>) => {
                this.allAssignedCalls = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getAllGroundVictimQueryCalls(this.currentIncidentId);
    }
}