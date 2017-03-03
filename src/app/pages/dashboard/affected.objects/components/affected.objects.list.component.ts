import { Component, ViewEncapsulation , OnInit } from '@angular/core';

import { InvolvedPartyModel } from '../../InvolvedParty';
import { AffectedObjectsToView } from './affected.objects.model';
import { AffectedObjectsService } from './affected.objects.service';
import { ResponseModel,DataExchangeService } from '../../../../shared';

@Component({
    selector: 'affectedobject-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.objects.list.view.html'
})
export class AffectedObjectsListComponent {
     constructor(private affectedObjectService: AffectedObjectsService) { }
     affectedObjects : AffectedObjectsToView[];

 ngOnInit(): any {
       this.affectedObjectService.GetFilterByIncidentId()
        .subscribe((response: ResponseModel<InvolvedPartyModel>) => {
                this.affectedObjects =this.affectedObjectService.FlattenData( response.Records[0]);                
            },(error: any) => {
                console.log("error:  "+error);
            });
    }

}