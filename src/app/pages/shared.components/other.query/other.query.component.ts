import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { EnquiryService, EnquiryModel, QueryModel } from '../call.centre/components';
import { ResponseModel,GlobalConstants } from '../../../shared';

@Component({
    selector: 'other-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/other.query.view.html'
})
export class OtherQueryComponent implements OnInit {
    otherqueries: QueryModel[];
    incidentId: number;
    
    constructor(private enquiryService: EnquiryService) {       
        this.incidentId = 19;
    };

    getOtherQueries(incidentId): void {
        this.enquiryService.getOtherQueryByIncident(incidentId)
            .subscribe((response: ResponseModel<EnquiryModel>) => {
                this.otherqueries = this.enquiryService.MapQuery(response.Records);
            }, (error: any) => {
                console.log("error:  " + error);
            });
    };

    ngOnInit(): any {
        this.getOtherQueries(this.incidentId);

    }

}