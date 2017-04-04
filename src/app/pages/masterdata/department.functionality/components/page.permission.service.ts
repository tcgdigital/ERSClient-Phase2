import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { PagePermissionModel } from './department.functionality.model';
import { IPagePermissionService } from './IPagePermissionService';
import {
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService,
    ServiceBase
} from '../../../../shared';


@Injectable()
export class PagePermissionService extends ServiceBase<PagePermissionModel>
    implements IPagePermissionService {
    private _bulkDataService: DataService<PagePermissionModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'PagePermissions');
        let option: DataProcessingService = new DataProcessingService();

        this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptions<PagePermissionModel>('PermissionBatch/BatchPostAsync', option);
    }

    GetFilter(deptId: string): Observable<ResponseModel<PagePermissionModel>> {
        return this._dataService.Query()
            .Filter(`DepartmentId eq ${deptId}`)
            .Execute();
    }

    CreateBulk(entities: PagePermissionModel[]): Observable<PagePermissionModel[]> {
        return this._bulkDataService.BulkPost(entities).Execute();
    }
}