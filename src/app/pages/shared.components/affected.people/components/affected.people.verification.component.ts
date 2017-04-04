import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { InvolvePartyModel } from '../../../shared.components';
import { AffectedPeopleToView, AffectedPeopleModel } from './affected.people.model';
import { AffectedPeopleService } from './affected.people.service';
import { ResponseModel, DataExchangeService, GlobalStateService } from '../../../../shared';
import { InvolvePartyService } from '../../involveparties';

@Component({
    selector: 'affectedpeople-verify',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.people.verification.html'
})
export class AffectedPeopleVerificationComponent implements OnInit {
    constructor(private affectedPeopleService: AffectedPeopleService,
        private involvedPartyService: InvolvePartyService, private globalState: GlobalStateService) { }
    affectedPeopleForVerification: AffectedPeopleToView[];
    verifiedAffectedPeople: AffectedPeopleModel[];
    date: Date = new Date();
    currentIncident: number = 1;

    getAffectedPeople(currentIncident): void {
        this.involvedPartyService.GetFilterByIncidentId(currentIncident)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedPeopleForVerification = this.affectedPeopleService.FlattenAffectedPeople(response.Records[0]);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }


    saveVerifiedAffectedPeople(): void {
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


    incidentChangeHandler(incidentId) {
        this.currentIncident = incidentId;
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