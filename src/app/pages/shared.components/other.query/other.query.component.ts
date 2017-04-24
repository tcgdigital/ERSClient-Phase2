import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';

import { EnquiryService, EnquiryModel, QueryModel } from '../call.centre/components';
import {
    ResponseModel, GlobalConstants, KeyValue,
    GlobalStateService, UtilityService
} from '../../../shared';

@Component({
    selector: 'other-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/other.query.view.html'
})
export class OtherQueryComponent implements OnInit, OnDestroy {
    otherqueries: QueryModel[] = [];
    currentincidentId: number;

    /**
     * Creates an instance of OtherQueryComponent.
     * @param {EnquiryService} enquiryService 
     * @param {GlobalStateService} globalState 
     * 
     * @memberOf OtherQueryComponent
     */
    constructor(private enquiryService: EnquiryService,
        private globalState: GlobalStateService) {
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
        this.currentincidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.getOtherQueries(this.currentincidentId);
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentincidentId = incident.Value;
        this.getOtherQueries(this.currentincidentId);
    }

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }

}