import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {
    DataService, DataServiceFactory,
    DataProcessingService
} from '../../../shared/services/data.service';
// import {
//     DataService,
//     DataServiceFactory, DataProcessingService
// } from '../../../shared';
import { IncidentModel } from '../../../pages/incident/components/incident.model';

@Injectable()
export class IncidentClosureIndicationService {
    private _incidentService: DataService<IncidentModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        const option: DataProcessingService = new DataProcessingService();
        this._incidentService = dataServiceFactory
            .CreateServiceWithOptions<IncidentModel>('Incidents', option);
    }

    IsAnyOpenIncidents(): Observable<boolean> {
        return this._incidentService.Count()
            .Filter("ClosedBy eq null and ClosedOn eq null and IncidentId ne 0")
            .Execute().map((x) => x > 0);
    }
}