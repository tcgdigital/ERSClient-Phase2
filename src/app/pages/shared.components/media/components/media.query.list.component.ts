import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';

import { EnquiryService, EnquiryModel, QueryModel } from '../../call.centre/components';
import {
    ResponseModel, GlobalConstants, KeyValue,
    GlobalStateService, UtilityService
} from '../../../../shared';

@Component({
    selector: 'media-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.query.list.view.html'
})
export class MediaQueryListComponent implements OnInit, OnDestroy {
    mediaQueries: QueryModel[] = [];
    currentincidentId: number;
    constructor(private enquiryService: EnquiryService, private globalState: GlobalStateService) {
    };

    getMediaQueries(incidentId): void {
        this.enquiryService.getMediaQueryByIncident(incidentId)
            .subscribe((response: ResponseModel<EnquiryModel>) => {
                this.mediaQueries = this.enquiryService.MapQuery(response.Records);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    ngOnInit(): any {
        this.currentincidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.getMediaQueries(this.currentincidentId);
        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentincidentId = incident.Value;
        this.getMediaQueries(this.currentincidentId);
    }

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChangefromDashboard');
    }
}