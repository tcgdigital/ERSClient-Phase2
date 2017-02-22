import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DepartmentModel } from './department.model';
import {
    RequestModel,
    ResponseModel,
    BaseModel,
    WEB_METHOD,
    DataProcessingService,
    DataService,
    DataServiceFactory,
    GlobalConstants,
    IServiceInretface
} from '../../../../shared';

@Injectable()
export class DepartmentService implements IServiceInretface<DepartmentModel> {
    private _dataService: DataService<DepartmentModel>;
    private _batchDataService: DataService<BaseModel>;

    /**
     * Creates an instance of DepartmentService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf DepartmentService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<DepartmentModel>('Departments', option);

        option = new DataProcessingService();
        option.EndPoint = GlobalConstants.BATCH;
        this._batchDataService = this.dataServiceFactory
            .CreateServiceWithOptions<DepartmentModel>('', option);
    }

    GetAll(): Observable<ResponseModel<DepartmentModel>> {
        return this._dataService.Query()
            .Expand('ParentDepartment($select=DepartmentName)', 'UserProfile($select=Name)')
            .Filter('ActiveFlag eq CMS.DataModel.Enum.ActiveFlag\'Active\'')
            .Execute();
    }

    Get(id: string | number): Observable<DepartmentModel> {
        return this._dataService.Get(id.toString()).Execute();
    }

    Create(entity: DepartmentModel): Observable<DepartmentModel> {
        return Observable.of(entity);
    }

    CreateBulk(entities: DepartmentModel[]): Observable<DepartmentModel[]> {
        return Observable.of(entities);
    }

    Update(entity: DepartmentModel): Observable<DepartmentModel> {
        return Observable.of(entity);
    }

    Delete(entity: DepartmentModel): void {
    }

    /**
     * Initiate Batch operation
     * 
     * @returns {Observable<ResponseModel<BaseModel>>} 
     * 
     * @memberOf DepartmentService
     */
    BatchOperation(): Observable<ResponseModel<BaseModel>> {
        let requests: Array<RequestModel<BaseModel>> = [];
        requests.push(new RequestModel<BaseModel>('/odata/Departments', WEB_METHOD.GET));
        requests.push(new RequestModel<BaseModel>('/odata/EmergencyTypes', WEB_METHOD.GET));

        return this._batchDataService.BatchPost<BaseModel>(requests)
            .Execute();
    }
}