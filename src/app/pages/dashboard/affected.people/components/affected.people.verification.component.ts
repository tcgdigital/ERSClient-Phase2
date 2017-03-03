import { Component, ViewEncapsulation , OnInit } from '@angular/core';

import { InvolvedPartyModel } from '../../InvolvedParty';
import { AffectedPeopleToView, AffectedPeopleModel } from './affected.people.model';
import { AffectedPeopleService } from './affected.people.service';
import { ResponseModel,DataExchangeService } from '../../../../shared';

@Component({
    selector: 'affectedpeople-verify',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.people.verification.html'
})
export class AffectedPeopleVerificationComponent {
     constructor(private affectedPeopleService: AffectedPeopleService) { }
     affectedPeopleForVerification : AffectedPeopleToView[];
     verifiedAffectedPeople : AffectedPeopleModel[];
     date: Date = new Date(); 
     currentIncident : number = 88;

  getAffectedPeople(currentIncident){
     this.affectedPeopleService.GetFilterByIncidentId(currentIncident)
        .subscribe((response: ResponseModel<InvolvedPartyModel>) => {
                this.affectedPeopleForVerification =this.affectedPeopleService.FlattenData( response.Records[0]);
                console.log("affected:  "+this.affectedPeopleForVerification);
            },(error: any) => {
                console.log("error:  "+error);
            });
    }
  

  save(){        
        let datenow=this.date;
         this.verifiedAffectedPeople = this.affectedPeopleForVerification.map(function (affected) {
             let item = new AffectedPeopleModel;                   
                        item.AffectedPersonId= affected.AffectedPersonId;
                        item.IsVerified= affected.IsVerified,
                        item.UpdatedBy= 1;
                        item.UpdatedOn= datenow;
                        item.ActiveFlag = 'Active';
                       item.CreatedBy = 1;
                       item.CreatedOn = datenow;
                       return item;
         });
        this.affectedPeopleService.CreateBulk(this.verifiedAffectedPeople)
            .subscribe((response: AffectedPeopleModel[]) => { 
                this.getAffectedPeople(this.currentIncident);
            }, (error: any) => {
                console.log(error);
            });
    };


    

 ngOnInit(): any {
    this.getAffectedPeople(this.currentIncident);
 }

}