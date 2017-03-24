import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { InvolvePartyModel } from '../../../shared.components';
import { AffectedPeopleToView, AffectedPeopleModel } from './affected.people.model';
import { AffectedPeopleService } from './affected.people.service';
import { ResponseModel, DataExchangeService, GlobalConstants } from '../../../../shared';

@Component({
    selector: 'affectedpeople-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.people.list.view.html'
})
export class AffectedPeopleListComponent implements OnInit {
    constructor(private affectedPeopleService: AffectedPeopleService) { }
    affectedPeople: AffectedPeopleToView[];
    currentIncident: number = 88;
    medicalStatus: any[] = GlobalConstants.MedicalStatus;
    affectedPersonToUpdate: AffectedPeopleModel = new AffectedPeopleModel();
    //   medicalStatusForm: string = "";

    open(affectedPerson: AffectedPeopleToView) {
        affectedPerson["showDiv"] = !affectedPerson["showDiv"];
    }

    ok(affectedModifiedForm: AffectedPeopleToView) {

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
    cancel(affectedModifiedForm: AffectedPeopleToView) {
        affectedModifiedForm["showDiv"] = false;
        affectedModifiedForm["MedicalStatusToshow"] = affectedModifiedForm.MedicalStatus;

    };

    getAffectedPeople(currentIncident) {
        this.affectedPeopleService.GetFilterByIncidentId(currentIncident)
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

    ngOnInit(): any {
        this.getAffectedPeople(this.currentIncident);
    }
}