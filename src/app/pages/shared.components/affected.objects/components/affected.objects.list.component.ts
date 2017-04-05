import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { InvolvePartyModel } from '../../../shared.components';
import { AffectedObjectsToView } from './affected.objects.model';
import { AffectedObjectsService } from './affected.objects.service';
import { ResponseModel, DataExchangeService, GlobalStateService } from '../../../../shared';

@Component({
    selector: 'affectedobject-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.objects.list.view.html'
})
export class AffectedObjectsListComponent implements OnInit {
    constructor(private affectedObjectService: AffectedObjectsService, private globalState: GlobalStateService) { }
    affectedObjects: AffectedObjectsToView[];
    currentIncident: number = 1;

    getAffectedObjects(incidentId): void {
        this.affectedObjectService.GetFilterByIncidentId(incidentId)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedObjects = this.affectedObjectService.FlattenAffactedObjects(response.Records[0]);
                console.log(this.affectedObjects);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    incidentChangeHandler(incidentId) {
         this.currentIncident=incidentId;
        this.getAffectedObjects(incidentId);
    }
    ngOnInit(): any {

        this.getAffectedObjects(this.currentIncident);
        this.globalState.Subscribe('incidentChange', (model) => this.incidentChangeHandler(model));
    }
      ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
    }

}