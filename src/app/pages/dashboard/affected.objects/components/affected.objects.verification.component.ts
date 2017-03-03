import { Component, ViewEncapsulation , OnInit } from '@angular/core';

import { InvolvedPartyModel } from '../../InvolvedParty';
import { AffectedObjectModel, AffectedObjectsToView } from './affected.objects.model';
import { AffectedObjectsService } from './affected.objects.service';
import { ResponseModel, DataExchangeService } from '../../../../shared';

@Component({
    selector: 'affectedpeople-verify',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.objects.verification.html'
})
export class AffectedObjectsVerificationComponent {
    constructor(private affectedObjectsService: AffectedObjectsService) { }
    affectedObjectsForVerification: AffectedObjectsToView[];
    verifiedAffectedObjects: AffectedObjectModel[];
    date: Date = new Date();

    getAffectedObjects() {
        this.affectedObjectsService.GetFilterByIncidentId()
            .subscribe((response: ResponseModel<InvolvedPartyModel>) => {
                this.affectedObjectsForVerification = this.affectedObjectsService.FlattenData(response.Records[0]);
            }, (error: any) => {
                console.log("error:  " + error);
            });
    }


    save() {
        let datenow = this.date;
        this.verifiedAffectedObjects = this.affectedObjectsForVerification.map(function (affected) {
            let item = new AffectedObjectModel;
            item.AffectedObjectId = affected.AffectedObjectId;
            item.IsVerified = affected.IsVerified,
            item.UpdatedBy = 1;
            item.UpdatedOn = datenow;
            item.ActiveFlag = 'Active';
            item.CreatedBy = 1;
            item.CreatedOn = datenow;
            return item;
        });
        this.affectedObjectsService.CreateBulk(this.verifiedAffectedObjects)
            .subscribe((response: AffectedObjectModel[]) => {
                this.getAffectedObjects();
            }, (error: any) => {
                console.log(error);
            });
    };




    ngOnInit(): any {
        this.getAffectedObjects();
    }

}