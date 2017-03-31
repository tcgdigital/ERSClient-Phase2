import { Component, ViewEncapsulation , OnInit } from '@angular/core';

import { InvolvePartyModel } from '../../../shared.components';
import { AffectedObjectsToView } from './affected.objects.model';
import { AffectedObjectsService } from './affected.objects.service';
import { ResponseModel,DataExchangeService } from '../../../../shared';

@Component({
    selector: 'affectedobject-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.objects.list.view.html'
})
export class AffectedObjectsListComponent implements OnInit {
     constructor(private affectedObjectService: AffectedObjectsService) { }
     affectedObjects : AffectedObjectsToView[];
     currentIncident : number =88;

 ngOnInit(): any {
       this.affectedObjectService.GetFilterByIncidentId(this.currentIncident)
        .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedObjects =this.affectedObjectService.FlattenAffactedObjects( response.Records[0]);                
            },(error: any) => {
                console.log(`Error: ${error}`);
            });
    }

}