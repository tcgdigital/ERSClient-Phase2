import { Injectable, Output, EventEmitter } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { PageModel } from './department.functionality.model';
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
export class PageService implements IServiceInretface<PageModel>{
    private _dataServiceForPage: DataService<PageModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataServiceForPage = this.dataServiceFactory
            .CreateServiceWithOptions<PageModel>('Pages', option);
    }

    GetAll(): Observable<ResponseModel<PageModel>> {
        return this._dataServiceForPage.Query().Execute();
    }

    GetFilter(filter: string): Observable<ResponseModel<PageModel>> {
        return this._dataServiceForPage.Query()
            .Filter(filter)
            .Execute();
    }

    Get(id: string | number): Observable<PageModel> {
        let entity: PageModel;
        return Observable.of(entity);
    }

    Create(entity: PageModel): Observable<PageModel> {
        return Observable.of(entity);
    }

    CreateBulk(entities: PageModel[]): Observable<PageModel[]> {
        return Observable.of(entities);
    }

    Update(entity: PageModel): Observable<PageModel> {
        return Observable.of(entity);
    }

    Delete(entity: PageModel): void {
    }

    // GetAllPages(): Observable<ResponseModel<PageModel>> {
    //     return this._dataServiceForPage.Query().Execute();
    // }

    // GetAllPagePermissionsForDepartment(departmentId): Observable<ResponseModel<PagePermissionModel>> {
    //     return this._dataServiceForPagePermission.Query().Filter('DepartmentId eq ' + departmentId)
    //         .Execute();
    // }
}