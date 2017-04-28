import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';


import { InvolvePartyModel, CommunicationLogModel } from '../../../shared.components';
import { AffectedObjectsToView, AffectedObjectModel } from './affected.objects.model';
import { AffectedObjectsService } from './affected.objects.service';
import {
    ResponseModel, DataExchangeService,
    GlobalStateService, KeyValue, UtilityService
} from '../../../../shared';
import { ModalDirective } from 'ng2-bootstrap/modal';

@Component({
    selector: 'affectedobject-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.objects.list.view.html'
})
export class AffectedObjectsListComponent implements OnInit {
    @ViewChild('childModal') public childModal: ModalDirective;

    constructor(private affectedObjectService: AffectedObjectsService, private globalState: GlobalStateService, private _router: Router) { }
    affectedObjects: AffectedObjectsToView[] = [];
    currentIncident: number;
    communications: CommunicationLogModel[] = [];
    AWBNumber: string = "";
    ticketNumber: string = "";
    isArchive: boolean = false;
    protected _onRouteChange: Subscription;


    getAffectedObjects(incidentId): void {
        this.affectedObjectService.GetFilterByIncidentId(incidentId)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedObjects = this.affectedObjectService.FlattenAffactedObjects(response.Records[0]);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    incidentChangeHandler(incident: KeyValue) {
        this.currentIncident = incident.Value;
        this.getAffectedObjects(this.currentIncident);
    }

    ngOnInit(): any {
        this._onRouteChange = this._router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (event.url.indexOf("archivedashboard") > -1) {
                    this.isArchive = true;
                    this.currentIncident = +UtilityService.GetFromSession("ArchieveIncidentId");
                    this.getAffectedObjects(this.currentIncident);
                }
                else {
                    this.isArchive = false;
                    this.currentIncident = +UtilityService.GetFromSession("CurrentIncidentId");
                    this.getAffectedObjects(this.currentIncident);
                }
            }
        });

        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
    }

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
    }

    openChatTrails(affectedObjectId): void {
        this.affectedObjectService.GetCommunicationByAWB(affectedObjectId)
            .subscribe((response: ResponseModel<AffectedObjectModel>) => {
                let responseModel: AffectedObjectModel = response.Records[0];
                this.ticketNumber = responseModel.TicketNumber;
                this.communications = responseModel.CommunicationLogs;
                this.AWBNumber = responseModel.Cargo.AWB;
                this.childModal.show();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    cancelTrailModal(): void {
        this.childModal.hide();
    }
}