import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';

import { 
    EnquiryService, EnquiryModel, QueryModel 
} from '../../call.centre/components';
import {
    ResponseModel, KeyValue,
    GlobalStateService, UtilityService, GlobalConstants
} from '../../../../shared';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'media-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.query.list.view.html'
})
export class MediaQueryListComponent implements OnInit, OnDestroy {
    mediaQueries: QueryModel[] = [];
    currentincidentId: number;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     *Creates an instance of MediaQueryListComponent.
     * @param {EnquiryService} enquiryService
     * @param {GlobalStateService} globalState
     * @memberof MediaQueryListComponent
     */
    constructor(private enquiryService: EnquiryService, 
        private globalState: GlobalStateService) {
    }

    getMediaQueries(incidentId): void {
        this.enquiryService.getMediaQueryByIncident(incidentId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<EnquiryModel>) => {
                this.mediaQueries = this.enquiryService.MapQuery(response.Records);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    ngOnInit(): any {
        this.currentincidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.getMediaQueries(this.currentincidentId);
        
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard, 
            (model: KeyValue) => this.incidentChangeHandler(model));
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentincidentId = incident.Value;
        this.getMediaQueries(this.currentincidentId);
    }

    ngOnDestroy(): void {
        //this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}