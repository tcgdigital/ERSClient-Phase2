import { Component, ViewEncapsulation ,OnInit} from '@angular/core';

import { InvolvedPartyModel } from '../../InvolvedParty';
import { AffectedPeopleToView , AffectedPeopleModel } from './affected.people.model';
import { AffectedPeopleService } from './affected.people.service';
import { ResponseModel,DataExchangeService , GlobalConstants } from '../../../../shared';

@Component({
    selector: 'affectedpeople-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.people.list.view.html'
})
export class AffectedPeopleListComponent {
     constructor(private affectedPeopleService: AffectedPeopleService) { }
     affectedPeople : AffectedPeopleToView[];
     currentIncident : number = 88;
     medicalStatus : any[] = GlobalConstants.MedicalStatus;
     affectedPersonToUpdate : AffectedPeopleModel = new AffectedPeopleModel();
     medicalStatusForm : string = "";

     open(affectedPerson : AffectedPeopleToView){
         affectedPerson["showDiv"] =!affectedPerson["showDiv"];
         this.medicalStatusForm = affectedPerson.MedicalStatus;
     }

ok(affectedModifiedForm : AffectedPeopleToView){

    this.affectedPersonToUpdate.AffectedPersonId = affectedModifiedForm.AffectedPersonId;
    this.affectedPersonToUpdate.Identification = affectedModifiedForm.Identification;
    this.affectedPersonToUpdate.MedicalStatus =  this.medicalStatusForm;
    this.affectedPersonToUpdate.Remarks = affectedModifiedForm.Remarks;
    this.affectedPeopleService.Update(this.affectedPersonToUpdate, this.affectedPersonToUpdate.AffectedPersonId )
          .subscribe((response: AffectedPeopleModel) => {
              console.log("Updatedd");
                }, (error: any) => {
                    console.log(error);
                });

}
 ngOnInit(): any {
       this.affectedPeopleService.GetFilterByIncidentId(this.currentIncident)
        .subscribe((response: ResponseModel<InvolvedPartyModel>) => {

                this.affectedPeople =this.affectedPeopleService.FlattenData( response.Records[0]);
                this.affectedPeople.forEach(x=> x["showDiv"] = false);
                console.log("affected:  "+this.affectedPeople);
            },(error: any) => {
                console.log("error:  "+error);
            });
    }

}