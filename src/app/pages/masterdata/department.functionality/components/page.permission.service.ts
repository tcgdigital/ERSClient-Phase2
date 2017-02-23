import { Injectable, Output, EventEmitter } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { PagePermissionModel } from './department.functionality.model';
import {
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataOperation,
    GlobalConstants,
    DataProcessingService,
    IServiceInretface
} from '../../../../shared';


@Injectable()
export class PagePermissionService implements IServiceInretface<PagePermissionModel>{
    private _dataServiceForPagePermission: DataService<PagePermissionModel>;
    private _bulkDataService: DataService<PagePermissionModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataServiceForPagePermission = this.dataServiceFactory
            .CreateServiceWithOptions<PagePermissionModel>('PagePermissions', option);
         this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptions<PagePermissionModel>('PermissionBatch/BatchPostAsync', option);
    }

    GetAll(): Observable<ResponseModel<PagePermissionModel>> {
        return this._dataServiceForPagePermission.Query().Execute();
    }

    GetFilter(deptId: string): Observable<ResponseModel<PagePermissionModel>> {
        return this._dataServiceForPagePermission.Query()
            .Filter(`DepartmentId eq ${deptId}`)
            .Execute();
    }

    Get(id: string | number): Observable<PagePermissionModel> {
        let entity: PagePermissionModel;
        return Observable.of(entity);
    }

    Create(entity: PagePermissionModel): Observable<PagePermissionModel> {
        return Observable.of(entity);
    }

    CreateBulk(entities: PagePermissionModel[]): Observable<PagePermissionModel[]> {
       return this._bulkDataService.BulkPost(entities).Execute();
    }

    Update(entity: PagePermissionModel): Observable<PagePermissionModel> {
        return Observable.of(entity);
    }

    Delete(entity: PagePermissionModel): void {
    }
}