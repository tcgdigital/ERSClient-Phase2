import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';

import { EnquiryService, EnquiryModel, QueryModel } from '../call.centre/components';
import {
    ResponseModel, GlobalConstants,
    GlobalStateService, UtilityService, KeyValue
} from '../../../shared';

@Component({
    selector: 'crew-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/crew.query.view.html'
})
export class CrewQueryComponent implements OnInit, OnDestroy {
    crewqueries: QueryModel[] = [];
    currentincidentId: number;

    /**
     * Creates an instance of CrewQueryComponent.
     * @param {EnquiryService} enquiryService 
     * @param {GlobalStateService} globalState 
     * 
     * @memberOf CrewQueryComponent
     */
    constructor(private enquiryService: EnquiryService,
        private globalState: GlobalStateService) {
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
        this.currentincidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.getOtherQueries(this.currentincidentId);
        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentincidentId = incident.Value;
        this.getOtherQueries(this.currentincidentId);
    }

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChangefromDashboard');
        this.globalState.Unsubscribe('departmentChange');
    }
}