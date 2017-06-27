import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AffectedPeopleModel } from '../../shared.components/affected.people';
import { AffectedPeopleService } from '../../shared.components/affected.people';
import { CasualtySummeryModel } from './casualty.summary.widget.model';
import {
    IServiceInretface,
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService,
    ServiceBase

} from '../../../shared';

@Injectable()
export class CasualtySummaryWidgetService {
    public casualtySummery: CasualtySummeryModel;

    constructor(private dataServiceFactory: DataServiceFactory,
        private affectedPeopleService: AffectedPeopleService) {
        this.casualtySummery = new CasualtySummeryModel();
    }

    

    public GetCasualtyCount(incidentId: number): Observable<CasualtySummeryModel> {
        return this.affectedPeopleService.GetCasualtyStatus(incidentId)
            .map((dataCasualtySummery: CasualtySummeryModel) => {
                this.casualtySummery = dataCasualtySummery;
                return this.casualtySummery;
            });
    }
}