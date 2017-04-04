import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { EnquiryService, EnquiryModel, QueryModel } from '../call.centre/components';
import { ResponseModel,GlobalConstants,GlobalStateService } from '../../../shared';

@Component({
    selector: 'other-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/other.query.view.html'
})
export class OtherQueryComponent implements OnInit {
    otherqueries: QueryModel[];
    currentincidentId: number;
    
    constructor(private enquiryService: EnquiryService, private globalState: GlobalStateService) {       
        this.currentincidentId = 1;
    };

    getOtherQueries(incidentId): void {
        this.enquiryService.getOtherQueryByIncident(incidentId)
            .subscribe((response: ResponseModel<EnquiryModel>) => {
                this.otherqueries = this.enquiryService.MapQuery(response.Records);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    ngOnInit(): any {
        this.getOtherQueries(this.currentincidentId);
        this.globalState.Subscribe('incidentChange', (model) => this.incidentChangeHandler(model));

    }

     private incidentChangeHandler(incidentId): void {
        this.currentincidentId = incidentId;
        this.getOtherQueries(this.currentincidentId);
    }

   ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }

}