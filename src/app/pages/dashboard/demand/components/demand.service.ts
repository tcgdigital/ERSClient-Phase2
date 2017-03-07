import { Injectable, Output, EventEmitter } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { DemandModel } from './demand.model';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService,
    IServiceInretface
} from '../../../../shared';

@Injectable()
export class DemandService implements IServiceInretface<DemandModel> {
    private _dataService: DataService<DemandModel>;
     private _bulkDataService: DataService<DemandModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<DemandModel>('DemandTypes', option);
            this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<DemandModel>
            ('DemandBatch', 'BatchPostAsync', option);
    }

    GetAll(): Observable<ResponseModel<DemandModel>> {
        return this._dataService.Query()
            .Expand('ApproverDepartment($select=DepartmentName)')
            .Execute();
    }

    Get(id: string | number): Observable<DemandModel> {
        return this._dataService.Get(id.toString()).Execute();
    }

    Create(entity: DemandModel): Observable<DemandModel> {
        return this._dataService.Post(entity).Execute();
    }

    CreateBulk(entities: DemandModel[]): Observable<DemandModel[]> {
        return this._bulkDataService.BulkPost(entities).Execute();
    }

    Update(entity: DemandModel): Observable<DemandModel> {
        let key: string = entity.DemandTypeId.toString()
        return this._dataService.Patch(entity, key)
            .Execute();
    }

    Delete(entity: DemandModel): void {
    }
}