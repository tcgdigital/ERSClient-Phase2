import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { InvolvePartyModel } from '../../../shared.components';
import { AffectedPeopleToView, AffectedPeopleModel } from './affected.people.model';
import { AffectedPeopleService } from './affected.people.service';
import { ResponseModel, DataExchangeService } from '../../../../shared';
import { InvolvePartyService } from '../../involveparties';

@Component({
    selector: 'affectedpeople-verify',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.people.verification.html'
})
export class AffectedPeopleVerificationComponent implements OnInit {
    constructor(private affectedPeopleService: AffectedPeopleService,
    private involvedPartyService : InvolvePartyService) { }
    affectedPeopleForVerification: AffectedPeopleToView[];
    verifiedAffectedPeople: AffectedPeopleModel[];
    date: Date = new Date();
    currentIncident: number = 88;

    getAffectedPeople(currentIncident) {
        this.involvedPartyService.GetFilterByIncidentId(currentIncident)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedPeopleForVerification = this.affectedPeopleService.FlattenAffectedPeople(response.Records[0]);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }


    save() {
        let datenow = this.date;
        this.verifiedAffectedPeople = this.affectedPeopleService.MapAffectedPeople(this.affectedPeopleForVerification);
        this.affectedPeopleService.CreateBulk(this.verifiedAffectedPeople)
            .subscribe((response: AffectedPeopleModel[]) => {
                alert("Selected People directly affected are verified");
                this.getAffectedPeople(this.currentIncident);

            }, (error: any) => {
                alert(error);
            });
    };




    ngOnInit(): any {
        this.getAffectedPeople(this.currentIncident);
    }

}