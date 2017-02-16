import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DepartmentModel } from './department.model';
import { ResponseModel } from '../../../../shared/models';
import {
    DataProcessingService,
    DataService,
    DataServiceFactory
} from '../../../../shared/services';


@Injectable()
export class DepartmentService {
    private _dataService: DataService<DepartmentModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<DepartmentModel>('Departments', option);
    }

    GetAllDepartments(): Observable<ResponseModel<DepartmentModel>> {
        return this._dataService.Query()
            .Expand('ParentDepartment($select=DepartmentName)', 'UserProfile($select=Name)')
            .Filter('ActiveFlaf eq CMS.DataModel.Enum.ActiveFlag\'Active\'')
            .Execute();
    }
}