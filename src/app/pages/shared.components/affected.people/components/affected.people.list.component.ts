import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';

import { InvolvePartyModel , CommunicationLogModel } from '../../../shared.components';
import { InvolvePartyService } from '../../involveparties';
import { AffectedPeopleToView, AffectedPeopleModel } from './affected.people.model';
import { AffectedPeopleService } from './affected.people.service';
import { ResponseModel, DataExchangeService, GlobalConstants, GlobalStateService } from '../../../../shared';
import { UtilityService } from '../../../../shared/services';
import { ModalDirective } from 'ng2-bootstrap/modal';


@Component({
    selector: 'affectedpeople-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.people.list.view.html'
})
export class AffectedPeopleListComponent implements OnInit {
    @ViewChild('childModal') public childModal: ModalDirective;
    @ViewChild('childModalForTrail') public childModalForTrail: ModalDirective;



    affectedPeople: AffectedPeopleToView[] = [];
    currentIncident: number;
    affectedPersonToUpdate: AffectedPeopleModel = new AffectedPeopleModel();
    IsDestroyed: boolean;
    affectedPersonModelForStatus: AffectedPeopleToView = new AffectedPeopleToView();
    medicalStatus: any[] = GlobalConstants.MedicalStatus;
    pdaNameForTrail: string = "";
    pdaReferenceNumberForTrail: string = "";
    communications : CommunicationLogModel[] =[];
    ticketNumber : string = "";


    /**
     * Creates an instance of AffectedPeopleListComponent.
     * 
     * @param {AffectedPeopleService} affectedPeopleService
     * @param {InvolvePartyService} involvedPartyService
     * @param {DataExchangeService<number>} dataExchange
     * @param {GlobalStateService} globalState
     * 
     * @memberOf AffectedPeopleListComponent
     */
    constructor(private affectedPeopleService: AffectedPeopleService,
        private involvedPartyService: InvolvePartyService, private dataExchange: DataExchangeService<number>,
        private globalState: GlobalStateService) { }

    //   medicalStatusForm: string = "";

    /**
     * 
     * 
     * @param {AffectedPeopleToView} affectedPerson
     * 
     * @memberOf AffectedPeopleListComponent
     */
    openAffectedPersonDetail(affectedPerson: AffectedPeopleToView): void {
        //  affectedPerson["showDiv"] = !affectedPerson["showDiv"];

        this.affectedPersonModelForStatus = affectedPerson;
        this.affectedPersonModelForStatus["MedicalStatusToshow"] = this.medicalStatus.find(x => { return x.value == affectedPerson.MedicalStatus; }).value;
        this.childModal.show();
    }

    cancelModal() {
        this.childModal.hide();
    }

    saveUpdateAffectedPerson(affectedModifiedForm: AffectedPeopleToView): void {
        this.affectedPersonToUpdate.AffectedPersonId = affectedModifiedForm.AffectedPersonId;
        this.affectedPersonToUpdate.Identification = affectedModifiedForm.Identification;
        this.affectedPersonToUpdate.MedicalStatus = affectedModifiedForm["MedicalStatusToshow"];
        this.affectedPersonToUpdate.Remarks = affectedModifiedForm.Remarks;
        this.affectedPeopleService.Update(this.affectedPersonToUpdate)
            .subscribe((response: AffectedPeopleModel) => {
                alert("Adiitional Information updated");
                this.getAffectedPeople(this.currentIncident);
                affectedModifiedForm["MedicalStatusToshow"] = affectedModifiedForm.MedicalStatus;
            }, (error: any) => {
                alert(error);
            });

    }
    cancelUpdate(affectedModifiedForm: AffectedPeopleToView): void {
        this.childModal.hide();
        this.affectedPersonModelForStatus = new AffectedPeopleToView();

    };

    getAffectedPeople(currentIncident): void {
        this.involvedPartyService.GetFilterByIncidentId(currentIncident)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedPeople = this.affectedPeopleService.FlattenAffectedPeople(response.Records[0]);
                this.affectedPeople.forEach(x =>
                    function () {
                        x["MedicalStatusToshow"] = x.MedicalStatus;
                        x["showDiv"] = false;

                    });
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };
    incidentChangeHandler(incidentId) {
        this.currentIncident = incidentId;
        this.getAffectedPeople(incidentId);
    }

    ngOnInit(): any {
        this.currentIncident = +UtilityService.GetFromSession("CurrentIncidentId");
        this.IsDestroyed = false;
        this.getAffectedPeople(this.currentIncident);
        this.globalState.Subscribe('incidentChange', (model) => this.incidentChangeHandler(model));
    }

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
    }


    openChatTrails(affectedPersonId: number): void {
        this.affectedPeopleService.GetCommunicationByPDA(affectedPersonId)
            .subscribe((response: ResponseModel<AffectedPeopleModel>) => {
                let responseModel: AffectedPeopleModel = response.Records[0];
                this.pdaNameForTrail = responseModel.Passenger != null ? responseModel.Passenger.PassengerName.toUpperCase() : '';
                this.pdaNameForTrail = this.pdaNameForTrail ? this.pdaNameForTrail : responseModel.Crew != null ? responseModel.Crew.CrewName.toUpperCase() : '';
                this.ticketNumber = responseModel.TicketNumber;
                this.communications = responseModel.CommunicationLogs;
                this.childModalForTrail.show();
        
       }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    cancelTrailModal(){
        this.childModalForTrail.hide();
    }
}