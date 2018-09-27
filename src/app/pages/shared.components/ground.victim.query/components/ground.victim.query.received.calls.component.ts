import { Component, OnInit, ViewChild } from '@angular/core';
import { ExternalInputModel, CallCenterOnlyPageService } from '../../../callcenteronlypage';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalStateService, UtilityService, GlobalConstants, KeyValue, ResponseModel } from '../../../../shared';
import { ModalDirective } from 'ngx-bootstrap';
import { GroundVictimService, GroundVictimModel } from '../../ground.victim';

@Component({
    selector: 'ground-victim-query-received-calls',
    templateUrl: '../views/ground.victim.query.received.calls.view.html',
    providers: [GroundVictimService]
})

export class GroundVictimQueryReceivedCallsComponent implements OnInit {
    @ViewChild(ModalDirective) public childModalcallcenter: ModalDirective;

    public allReceivedCalls: ExternalInputModel[] = [];
    public currentIncidentId: number;
    public isArchive: boolean = false;
    private callId: number;
    private callcenterload: boolean = false;
    private victims: KeyValue[] = [];

    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private callcenteronlypageservice: CallCenterOnlyPageService,
        private groundVictimService: GroundVictimService,
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

        this.getGroundVictims();

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.CallRecieved,
            (model: number) => this.getAllGroundVictimQueryReceivedCalls(this.currentIncidentId));

        // SignalR Notification
        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveGroundVictimEnquiryCreationResponse.Key,
            (model: ExternalInputModel) => {
                const index: number = this.allReceivedCalls
                    .findIndex((x: ExternalInputModel) => x.ExternalInputId === model.ExternalInputId);

                if (index > -1) {
                    this.allReceivedCalls.splice(index, 1, model);
                } else {
                    this.allReceivedCalls.unshift(model)
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

    private getAllGroundVictimQueryReceivedCalls(incidentId: number): void {
        this.childModalcallcenter.hide();
        this.callcenterload = false;
        this.callcenteronlypageservice.GetGroundVictimCallsRecievedByIncident(incidentId)
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<ExternalInputModel>) => {
                this.allReceivedCalls = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getAllGroundVictimQueryReceivedCalls(this.currentIncidentId);
    }

    private getGroundVictims(): void {
        this.groundVictimService.GetAllGroundVictimsByIncident(this.currentIncidentId)
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: GroundVictimModel) => {
                this.victims.push(new KeyValue(response.GroundVictimName, response.GroundVictimId));
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            }, () => { this.getAllGroundVictimQueryReceivedCalls(this.currentIncidentId); });
    }

    public getVictimName(groundVictimId: number): string {
        let Nm: string = "";
        Nm = this.victims.find(x => x.Value == groundVictimId).Key;
        return Nm;
    }
}