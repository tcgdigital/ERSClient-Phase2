import { Component, ViewEncapsulation, OnInit,ViewChild } from '@angular/core';

import { InvolvePartyModel , CommunicationLogModel } from '../../../shared.components';
import { AffectedObjectsToView , AffectedObjectModel } from './affected.objects.model';
import { AffectedObjectsService } from './affected.objects.service';
import { ResponseModel, DataExchangeService, GlobalStateService } from '../../../../shared';
import { UtilityService } from '../../../../shared/services';
import { ModalDirective } from 'ng2-bootstrap/modal';


@Component({
    selector: 'affectedobject-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.objects.list.view.html'
})
export class AffectedObjectsListComponent implements OnInit {
     @ViewChild('childModal') public childModal: ModalDirective;

    constructor(private affectedObjectService: AffectedObjectsService, private globalState: GlobalStateService) { }
    affectedObjects: AffectedObjectsToView[] =[];
    currentIncident: number;
    communications : CommunicationLogModel[]=[];
    AWBNumber : string ="";
    ticketNumber : string ="";

    getAffectedObjects(incidentId): void {
        this.affectedObjectService.GetFilterByIncidentId(incidentId)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedObjects = this.affectedObjectService.FlattenAffactedObjects(response.Records[0]);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    incidentChangeHandler(incidentId) {
        this.currentIncident = incidentId;
        this.getAffectedObjects(incidentId);
    }
    ngOnInit(): any {
        this.currentIncident = +UtilityService.GetFromSession("CurrentIncidentId");
        this.getAffectedObjects(this.currentIncident);
        this.globalState.Subscribe('incidentChange', (model) => this.incidentChangeHandler(model));
    }
    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
    }

    openChatTrails(affectedObjectId) : void{
                  this.affectedObjectService.GetCommunicationByAWB(affectedObjectId)
            .subscribe((response: ResponseModel<AffectedObjectModel>) => {
                let responseModel: AffectedObjectModel = response.Records[0];
               // this.pdaNameForTrail = responseModel.Passenger != null ? responseModel.Passenger.PassengerName.toUpperCase() : '';
               // this.pdaNameForTrail = this.pdaNameForTrail ? this.pdaNameForTrail : responseModel.Crew != null ? responseModel.Crew.CrewName.toUpperCase() : '';
                 this.ticketNumber = responseModel.TicketNumber;
                this.communications = responseModel.CommunicationLogs;
                this.AWBNumber = responseModel.Cargo.AWB;
                this.childModal.show();
        
       }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    cancelTrailModal() : void{
        this.childModal.hide();
    }

}