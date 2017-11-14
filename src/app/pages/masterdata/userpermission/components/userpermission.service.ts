import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DepartmentModel, DepartmentService } from '../../department';
import { UserPermissionModel, DepartmentsToView } from './userpermission.model';
import { NotifyPeopleModel } from '../../../notifypeople/components/notifypeople.model';
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

    public parentDepartmentUserPermission: ResponseModel<UserPermissionModel>;
    public childrenDepartmentUserPermission: ResponseModel<UserPermissionModel>;
    private _bulkDataService: DataService<UserPermissionModel>;
    private _userPermissionService: DataService<UserPermissionModel>;
    private departmentsToViewConstant: DepartmentsToView[] = [];

    /**
     * Creates an instance of UserPermissionService.
     * @param {DataServiceFactory} dataServiceFactory
     *
     * @memberOf UserPermissionService
     */
    constructor(private dataServiceFactory: DataServiceFactory, private departmentService: DepartmentService) {
        super(dataServiceFactory, 'UserPermissions');

        const option: DataProcessingService = new DataProcessingService();
        this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<UserPermissionModel>
            ('UserPermissionBatch', 'BatchPostAsync', option);

        this._userPermissionService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<UserPermissionModel>
            ('UserPermissionBatch', 'GetActiveHODUsersOfCrisisTypeSpecificDepartments', option);
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
        departments.forEach((department) => {
            const departmentsToView = new DepartmentsToView();
            departmentsToView.DepartmentId = department.DepartmentId;
            departmentsToView.DepartmentName = department.DepartmentName;
            departmentsToView.IsMemberOf = false;
            departmentsToView.IsHod = false;
            this.departmentsToViewConstant.push(departmentsToView);
        });
        return this.departmentsToViewConstant;
    }


    public GetAllUserPermissions(): Observable<ResponseModel<UserPermissionModel>> {
        return this._dataService.Query()
            .Expand('Department($select=DepartmentId,DepartmentName),User($select=Email,UserProfileId,UserId)')
            .OrderBy('CreatedOn desc')
            .Execute();
    }

    public GetAllDepartmentUsers(departmentId: number): Observable<ResponseModel<UserPermissionModel>> {
        const allChildDepartmentIdsProjection: string = '';
        const count: number = 1;
        return this._dataService.Query()
            .Expand('Department($select=DepartmentId,DepartmentName),User($select=Email,UserProfileId,UserId)')
            .Filter(`DepartmentId eq ${departmentId}`)
            .OrderBy('CreatedOn desc')
            .Execute();
    }

    public GetAllDepartmentUsersWithUsers(departmentId: number): Observable<ResponseModel<UserPermissionModel>> {
        const allChildDepartmentIdsProjection: string = '';
        const count: number = 1;
        return this._dataService.Query()
            .Expand('User($expand=Notifications($filter=SituationId eq 1 or SituationId eq 2;$select=AckStatus;))')
            .Filter(`DepartmentId eq ${departmentId} and User/isActive eq true`)
            .OrderBy('CreatedOn desc')
            .Execute();
    }

    public GetAllDepartmentUsersFromDepartmentIdProjection(departmentIdProjection: string): Observable<ResponseModel<UserPermissionModel>> {
        return this._dataService.Query()
            .Expand('Department($select=DepartmentId,DepartmentName),User')
            .Filter(`User/isActive eq true and ${departmentIdProjection}`)
            .OrderBy('CreatedOn desc')
            .Execute();
    }

    public GetAllDepartmentsFromDepartmentIdProjection(departmentIdProjection: string): Observable<ResponseModel<DepartmentModel>> {
        return this.departmentService.GetAllDepartmentsFromDepartmentIdProjection(departmentIdProjection);
    }

    public GetAllSubDepartments(departmentId: number): Observable<ResponseModel<DepartmentModel>> {
        return this.departmentService.GetAllActiveSubDepartments(departmentId);
    }

    public GetAllDepartmentMatrix(): Observable<ResponseModel<DepartmentModel>> {
        return this.departmentService.GetAllActiveDepartmentParentDepartmentMatrix();
    }

    public GetUserPermissionFromDepartments(allChildDepartmentIdsProjection: string): Observable<ResponseModel<UserPermissionModel>> {
        return this._dataService.Query()
            .Expand('Department($select=DepartmentId,DepartmentName),User($select=Email,UserProfileId,UserId)')
            .Filter(`${allChildDepartmentIdsProjection}`)
            .OrderBy('CreatedOn desc')
            .Execute();
    }

    public GetAllActiveHODUsersOfAllDepartments(): Observable<ResponseModel<UserPermissionModel>> {
        return this._dataService.Query()
            .Expand('User')
            .Filter(`IsHod eq true and ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active'`)
            .Execute();
    }

    public GetActiveHODUsersOfCrisisTypeSpecificDepartments(emergencyTypeId: number): Observable<UserPermissionModel[]> {
        return this._userPermissionService.SimpleGet(`/${emergencyTypeId}`)
            .Execute().map((resp) => {
                return resp as UserPermissionModel[];
            });
    }

    GetAllDepartmentsAssignedToUser(userId: number): Observable<ResponseModel<UserPermissionModel>> {
        return this._dataService.Query()
            .Expand('Department($expand=ParentDepartment($select=DepartmentName),UserProfile($select=Name))')
            .Filter(`UserId eq ${userId} and Department/ActiveFlag eq CMS.DataModel.Enum.ActiveFlag\'Active\'`)
            .Execute();
    }
}