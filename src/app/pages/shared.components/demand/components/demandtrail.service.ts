import { Injectable, Output, EventEmitter } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { DemandTrailModel } from './demand.trail.model';
import { DemandModel } from './demand.model';
import { IDemandTrailService } from './IDemandTrailService';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService, ServiceBase,
    IServiceInretface, BaseModel, RequestModel, GlobalConstants, WEB_METHOD
} from '../../../../shared';

@Injectable()
export class DemandTrailService extends ServiceBase<DemandTrailModel> implements IDemandTrailService {

    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'DemandTrails');
    }

    getDemandTrailByDemandId(demandId): Observable<ResponseModel<DemandTrailModel>> {
        return this._dataService.Query()
            .Filter(`DemandId eq  ${demandId}`)
            .Execute();

    }
}