import { Injectable, Output, EventEmitter } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { DemandRemarkLogModel } from './demand.model';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService,
    IServiceInretface, BaseModel, RequestModel, GlobalConstants, WEB_METHOD
} from '../../../../shared';

@Injectable()
export class DemandRemarkLogService implements IServiceInretface<DemandRemarkLogModel> {
    private _dataService: DataService<DemandRemarkLogModel>;
    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
    .CreateServiceWithOptions<DemandRemarkLogModel>('DemandRemarkLogs', option);
}
     GetAll():Observable<ResponseModel<DemandRemarkLogModel>> {
          return this._dataService.Query()
            .Execute();
    };

    Get(id: string|number): Observable<DemandRemarkLogModel> {
        return this._dataService.Get(id.toString()).Execute();
    };

    GetDemandRemarksByDemandId(demandId: number): Observable<ResponseModel<DemandRemarkLogModel>> {
        return this._dataService.Query()
            .Filter(`DemandId eq ${demandId}`)
            .Execute();
    };

    Create(entity: DemandRemarkLogModel):  Observable<DemandRemarkLogModel> {
        return this._dataService.Post(entity).Execute();
    };

    CreateBulk(entities: DemandRemarkLogModel[]): Observable<DemandRemarkLogModel[]> {
       return Observable.of(entities);
    };

    Update(entity: DemandRemarkLogModel): Observable<DemandRemarkLogModel> {
        let key: string = entity.DemandId.toString()
        return this._dataService.Patch(entity, key)
            .Execute();
    };

    Delete(key: number):void {
    };
}