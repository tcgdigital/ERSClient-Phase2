import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DepartmentModel } from '../../department';
import { UserPermissionModel, DepartmentsToView } from './userpermission.model';
import { IUserPermissionService } from './IUserPermissionService';
import {
    ResponseModel,
    DataService, DataServiceFactory,
    DataProcessingService,
    ServiceBase,
} from '../../../../shared';


@Injectable()
export class UserPermissionService
    extends ServiceBase<UserPermissionModel>
    implements IUserPermissionService {

    private _bulkDataService: DataService<UserPermissionModel>;
    private departmentsToViewConstant: DepartmentsToView[] = [];

    /**
     * Creates an instance of UserPermissionService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf UserPermissionService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'UserPermissions');

        let option: DataProcessingService = new DataProcessingService();
        this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<UserPermissionModel>
            ('UserPermissionBatch', 'BatchPostAsync', option);
    }

    public GetFilterByUsers(userId: number): Observable<ResponseModel<UserPermissionModel>> {
        return this._dataService.Query()
            .Filter(`UserId eq ${userId}`)
            .Execute();
    }

    public CreateBulk(entities: UserPermissionModel[]): Observable<UserPermissionModel[]> {
        console.log(entities.length);
        return this._bulkDataService.BulkPost(entities).Execute();
    }

    public CreateDefaultDepartmentList(departments: DepartmentModel[]): DepartmentsToView[] {
        this.departmentsToViewConstant = [];
        departments.forEach(department => {
            let departmentsToView = new DepartmentsToView();
            departmentsToView.DepartmentId = department.DepartmentId;
            departmentsToView.DepartmentName = department.DepartmentName;
            departmentsToView.IsMemberOf = false;
            departmentsToView.IsHod = false;
            this.departmentsToViewConstant.push(departmentsToView);
        });
        return this.departmentsToViewConstant;
    }
}