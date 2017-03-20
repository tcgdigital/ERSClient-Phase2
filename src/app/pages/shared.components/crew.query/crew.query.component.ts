import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { EnquiryService, EnquiryModel, QueryModel } from '../call.centre/components';
import { ResponseModel,GlobalConstants } from '../../../shared';

@Component({
    selector: 'crew-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/crew.query.view.html'
})
export class CrewQueryComponent implements OnInit {
    crewqueries: QueryModel[];
    incidentId: number;
    constructor(private enquiryService: EnquiryService) {        
        this.incidentId = 19;
    };

    getOtherQueries(incidentId): void {
        this.enquiryService.getCrewQueryByIncident(incidentId)
            .subscribe((response: ResponseModel<EnquiryModel>) => {
                this.crewqueries = this.enquiryService.MapQuery(response.Records);
            }, (error: any) => {
                console.log("error:  " + error);
            });
    };

    ngOnInit(): any {
        this.getOtherQueries(this.incidentId);

    }

}