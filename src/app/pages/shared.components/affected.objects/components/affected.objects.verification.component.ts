import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { InvolvePartyModel } from '../../../shared.components';
import { AffectedObjectModel, AffectedObjectsToView } from './affected.objects.model';
import { AffectedObjectsService } from './affected.objects.service';
import {
    ResponseModel, DataExchangeService,
    GlobalStateService, UtilityService, KeyValue
} from '../../../../shared';


@Component({
    selector: 'affectedpeople-verify',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.objects.verification.html'
})
export class AffectedObjectsVerificationComponent implements OnInit {
    constructor(private affectedObjectsService: AffectedObjectsService, private globalState: GlobalStateService) { }
    affectedObjectsForVerification: AffectedObjectsToView[] = [];
    verifiedAffectedObjects: AffectedObjectModel[];
    date: Date = new Date();
    currentIncident: number;

    getAffectedObjects(incidentId): void {
        this.affectedObjectsService.GetFilterByIncidentId(incidentId)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedObjectsForVerification = this.affectedObjectsService.FlattenAffactedObjects(response.Records[0]);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }


    saveVerifiedObjects(): void {
        let datenow = this.date;
        this.verifiedAffectedObjects = this.affectedObjectsService.MapAffectedPeopleToSave(this.affectedObjectsForVerification);
        this.affectedObjectsService.CreateBulkObjects(this.verifiedAffectedObjects)
            .subscribe((response: AffectedObjectModel[]) => {
                alert("Selected Objects are verified");
                this.getAffectedObjects(this.currentIncident);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    incidentChangeHandler(incident: KeyValue) {
        this.currentIncident = incident.Value;
        this.getAffectedObjects(this.currentIncident);
    }

    ngOnInit(): any {
        this.currentIncident = +UtilityService.GetFromSession("CurrentIncidentId");
        this.getAffectedObjects(this.currentIncident);
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
    }
    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
    }
}