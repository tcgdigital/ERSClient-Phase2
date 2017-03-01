import { Component, ViewEncapsulation } from '@angular/core';

import { InvolvedPartyModel } from '../../InvolvedParty';
import { AffectedPeopleToView } from './affected.people.model';
import { AffectedPeopleService } from './affected.people.service';
import { ResponseModel,DataExchangeService } from '../../../../shared';

@Component({
    selector: 'affectedpeople-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/affected.people.list.view.html'
})
export class AffectedPeopleListComponent {
     constructor(private affectedPeopleService: AffectedPeopleService) { }
     affectedPeople : AffectedPeopleToView[];

 ngOnInit(): any {
       this.affectedPeopleService.GetFilterByIncidentId()
        .subscribe((response: ResponseModel<InvolvedPartyModel>) => {

                this.affectedPeople =this.affectedPeopleService.FlattenData( response.Records[0]);
                debugger;                
                console.log("affected:  "+this.affectedPeople);
            },(error: any) => {
                console.log("error:  "+error);
            });
    }

}