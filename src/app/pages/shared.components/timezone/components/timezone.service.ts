import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { TimeZoneModel, TimeZoneModels, ZoneIndicator } from './timezone.model';
import {
    ResponseModel,
    DataServiceFactory, DataService,
    ServiceBase, DataProcessingService
} from '../../../../shared';

@Injectable()
export class TimeZoneService {

    private _bulkDataService: DataService<any>;
    constructor(private dataServiceFactory: DataServiceFactory) {

    }


    GetTimeZones(incidentId: number): Observable<TimeZoneModels> {
        let option = new DataProcessingService();
        let _reportService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<TimeZoneModels>
            ('TimeZone', `GetAllTimeZones/${incidentId}`, option);
        return _reportService.Get(incidentId.toString())
            .Execute();
    }

    GetLocalTime(indicator: ZoneIndicator): Observable<ZoneIndicator> {
        let option = new DataProcessingService();
        let _reportService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<TimeZoneModels>
            ('TimeZone', `GetSpecificTimeZoneFromAllTimeZones`, option);

        return _reportService.JsonPost(indicator).Execute();
    }
}