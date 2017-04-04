import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { InvolvePartyModel } from '../../../shared.components';
import { InvolvePartyService } from '../../involveparties';
import { AffectedPeopleToView, AffectedPeopleModel } from './affected.people.model';
import { AffectedPeopleService } from './affected.people.service';
import { ResponseModel, DataExchangeService, GlobalConstants,GlobalStateService } from '../../../../shared';

@Component({
    selector: 'affectedpeople-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.people.list.view.html'
})
export class AffectedPeopleListComponent implements OnInit {
    constructor(private affectedPeopleService: AffectedPeopleService,
    private involvedPartyService : InvolvePartyService, private dataExchange: DataExchangeService<number>,
    private globalState: GlobalStateService) { }
    affectedPeople: AffectedPeopleToView[];
    currentIncident: number = 1;
    affectedPersonToUpdate: AffectedPeopleModel = new AffectedPeopleModel();
    //   medicalStatusForm: string = "";

    openAffectedPersonDetail(affectedPerson: AffectedPeopleToView) : void {
        affectedPerson["showDiv"] = !affectedPerson["showDiv"];
    }

    saveUpdateAffectedPerson(affectedModifiedForm: AffectedPeopleToView) : void {

        this.affectedPersonToUpdate.AffectedPersonId = affectedModifiedForm.AffectedPersonId;
        this.affectedPersonToUpdate.Identification = affectedModifiedForm.Identification;
        this.affectedPersonToUpdate.MedicalStatus = affectedModifiedForm["MedicalStatusToshow"];
        this.affectedPersonToUpdate.Remarks = affectedModifiedForm.Remarks;
        this.affectedPeopleService.Update(this.affectedPersonToUpdate, this.affectedPersonToUpdate.AffectedPersonId)
            .subscribe((response: AffectedPeopleModel) => {
                alert("Adiitional Information updated");
                this.getAffectedPeople(this.currentIncident);
                affectedModifiedForm["showDiv"] = false;
                affectedModifiedForm["MedicalStatusToshow"] = affectedModifiedForm.MedicalStatus;
            }, (error: any) => {
                alert(error);
            });

    }
    cancelUpdate(affectedModifiedForm: AffectedPeopleToView) : void {
        affectedModifiedForm["showDiv"] = false;
        affectedModifiedForm["MedicalStatusToshow"] = affectedModifiedForm.MedicalStatus;

    };

    getAffectedPeople(currentIncident) : void {
        this.involvedPartyService.GetFilterByIncidentId(currentIncident)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {

                this.affectedPeople = this.affectedPeopleService.FlattenAffectedPeople(response.Records[0]);
                this.affectedPeople.forEach(x =>
                    function () {
                        x["showDiv"] = false;
                        x["MedicalStatusToshow"] = x.MedicalStatus;
                    });
                console.log("affected:  " + this.affectedPeople);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };
    incidentChangeHandler(incidentId){
        alert(incidentId);
             this.currentIncident=incidentId;
             this.getAffectedPeople(incidentId);
    }

    ngOnInit(): any {
        this.getAffectedPeople(this.currentIncident);
        this.globalState.Subscribe('incidentChange', (model) => this.incidentChangeHandler(model));
    }

      ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
    }
}