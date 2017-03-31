import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { EnquiryService, EnquiryModel, QueryModel } from '../../call.centre/components';
import { ResponseModel,GlobalConstants } from '../../../../shared';

@Component({
    selector: 'media-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.query.list.view.html'
})
export class MediaQueryListComponent implements OnInit {
    mediaQueries: QueryModel[];
    incidentId: number;
    constructor(private enquiryService: EnquiryService) {        
        this.incidentId = 3;
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
        this.getMediaQueries(this.incidentId);

    }

}