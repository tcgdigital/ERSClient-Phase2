import { Component, ViewEncapsulation , OnInit } from '@angular/core';

import { InvolvePartyModel } from '../../../shared.components';
import { AffectedObjectModel, AffectedObjectsToView } from './affected.objects.model';
import { AffectedObjectsService } from './affected.objects.service';
import { ResponseModel, DataExchangeService } from '../../../../shared';

@Component({
    selector: 'affectedpeople-verify',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.objects.verification.html'
})
export class AffectedObjectsVerificationComponent implements OnInit {
    constructor(private affectedObjectsService: AffectedObjectsService) { }
    affectedObjectsForVerification: AffectedObjectsToView[];
    verifiedAffectedObjects: AffectedObjectModel[];
    date: Date = new Date();
    currentIncident : number =88;

    getAffectedObjects() {
        this.affectedObjectsService.GetFilterByIncidentId(this.currentIncident)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedObjectsForVerification = this.affectedObjectsService.FlattenAffactedObjects(response.Records[0]);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }


    save() {
        let datenow = this.date;
        this.verifiedAffectedObjects = this.affectedObjectsService.MapAffectedPeopleToSave(this.affectedObjectsForVerification);
        this.affectedObjectsService.CreateBulk(this.verifiedAffectedObjects)
            .subscribe((response: AffectedObjectModel[]) => {
                alert("Selected Objects are verified");
                this.getAffectedObjects();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    ngOnInit(): any {
        this.getAffectedObjects();
    }
}