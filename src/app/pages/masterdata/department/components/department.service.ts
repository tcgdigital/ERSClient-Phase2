import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DepartmentModel } from './department.model';
import { ResponseModel } from '../../../../shared/models';
import {
    DataProcessingService,
    DataService,
    DataServiceFactory
} from '../../../../shared/services';

import { RequestModel, BaseModel, WEB_METHOD } from '../../../../shared/models';
import { GlobalConstants } from '../../../../shared/constants';


@Injectable()
export class DepartmentService {
    private _dataService: DataService<DepartmentModel>;
    private _batchDataService: DataService<BaseModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<DepartmentModel>('Departments', option);

        option = new DataProcessingService();
        option.EndPoint = GlobalConstants.BATCH;
        this._batchDataService = this.dataServiceFactory
            .CreateServiceWithOptions<DepartmentModel>('', option);
    }

    GetAllDepartments(): Observable<ResponseModel<DepartmentModel>> {
        return this._dataService.Query()
            .Expand('ParentDepartment($select=DepartmentName)', 'UserProfile($select=Name)')
            .Filter('ActiveFlag eq CMS.DataModel.Enum.ActiveFlag\'Active\'')
            .Execute();
    }

    BatchOperation(): Observable<ResponseModel<BaseModel>> {
        let requests: Array<RequestModel<BaseModel>> = [];
        requests.push(new RequestModel<BaseModel>('/odata/Departments', WEB_METHOD.GET));
        requests.push(new RequestModel<BaseModel>('/odata/EmergencyTypes', WEB_METHOD.GET));

        return this._batchDataService.BatchPost<BaseModel>(requests)
            .Execute();
    }
}