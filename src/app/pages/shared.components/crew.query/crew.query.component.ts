import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { EnquiryService, EnquiryModel, QueryModel } from '../call.centre/components';
import { ResponseModel, GlobalConstants, GlobalStateService } from '../../../shared';

@Component({
    selector: 'crew-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/crew.query.view.html'
})
export class CrewQueryComponent implements OnInit {
    crewqueries: QueryModel[];
    currentincidentId: number;
    constructor(private enquiryService: EnquiryService, private globalState: GlobalStateService) {
        this.currentincidentId = 1;
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