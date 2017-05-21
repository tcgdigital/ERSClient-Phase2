import { Injectable, Inject } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { AircraftTypeModel } from './aircrafttype.model';
import {
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService
} from '../../../../shared';


@Injectable()
export class AircraftTypeService {
    private _dataService: DataService<AircraftTypeModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<AircraftTypeModel>('AircraftTypes', option);
    }

    GetAllAircraftTypes(): Observable<ResponseModel<AircraftTypeModel>> {
        return this._dataService.Query()
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    GetAllActiveAircraftTypes(): Observable<ResponseModel<AircraftTypeModel>> {
        return this._dataService.Query()
            .Filter("ActiveFlag eq 'Active'")
            .OrderBy("CreatedOn desc")
            .Execute();
    }
   
}