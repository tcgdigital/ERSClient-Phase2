import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { EnquiryService, EnquiryModel, QueryModel } from '../../call.centre/components';
import { ResponseModel,GlobalConstants, GlobalStateService } from '../../../../shared';

@Component({
    selector: 'media-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.query.list.view.html'
})
export class MediaQueryListComponent implements OnInit {
    mediaQueries: QueryModel[];
    currentincidentId: number;
    constructor(private enquiryService: EnquiryService,  private globalState: GlobalStateService) {        
        this.currentincidentId = 1;
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
        this.getMediaQueries(this.currentincidentId);
        this.globalState.Subscribe('incidentChange', (model) => this.incidentChangeHandler(model));

    }

     private incidentChangeHandler(incidentId): void {
        this.currentincidentId = incidentId;
        this.getMediaQueries(this.currentincidentId);
    }

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }

}