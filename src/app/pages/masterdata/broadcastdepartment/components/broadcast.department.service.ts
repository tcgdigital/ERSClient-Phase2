import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { BroadCastDepartmentModel } from './broadcast.department.model';
import { IBroadCastDepartmentService } from './IBroadcastDepartmentService';
import {
    ResponseModel,
    DataServiceFactory, DataService,
    ServiceBase, DataProcessingService
} from '../../../../shared';

@Injectable()
export class BroadcastDepartmentService
    extends ServiceBase<BroadCastDepartmentModel>
    implements IBroadCastDepartmentService {
    private _bulkDataService: DataService<BroadCastDepartmentModel>;

    /**
     * Creates an instance of BroadcastDepartmentMappingService.
     * @param {DataServiceFactory} dataServiceFactory
     *
     * @memberOf BroadcastDepartmentMappingService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'BroadcastDepartmentMappings');
        const option: DataProcessingService = new DataProcessingService();

        this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<BroadCastDepartmentModel>
            ('BroadcastDepartmentMappingBatch', 'BatchPostAsync', option);
    }

    Query(departmentId: number): Observable<ResponseModel<BroadCastDepartmentModel>> {
        return this._dataService.Query()
            .Expand('TargetDepartment($select=DepartmentId,DepartmentName)')
            .Filter(`InitiationDepartmentId eq ${departmentId}`)
            .Execute();
    }

    CreateBulk(entities: BroadCastDepartmentModel[]): Observable<BroadCastDepartmentModel[]> {
        return this._bulkDataService
            .BulkPost(entities)
            .Execute();
    }
}