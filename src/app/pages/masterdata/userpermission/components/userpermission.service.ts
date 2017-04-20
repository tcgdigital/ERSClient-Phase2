import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DepartmentModel, DepartmentService } from '../../department';
import { UserPermissionModel, DepartmentsToView } from './userpermission.model';
import { NotifyPeopleModel } from "../../../notifypeople/components/notifypeople.model";
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
    public parentDepartmentUserPermission: ResponseModel<UserPermissionModel>;
    public childrenDepartmentUserPermission: ResponseModel<UserPermissionModel>;
    
    /**
     * Creates an instance of UserPermissionService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf UserPermissionService
     */
    constructor(private dataServiceFactory: DataServiceFactory, private departmentService: DepartmentService) {
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


    public GetAllUserPermissions(): Observable<ResponseModel<UserPermissionModel>> {
        return this._dataService.Query()
            .Expand('Department($select=DepartmentId,DepartmentName),User($select=Email,UserProfileId,UserId)')
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    public GetAllDepartmentUsers(departmentId: number): Observable<ResponseModel<UserPermissionModel>> {
        
        let allChildDepartmentIdsProjection: string = '';
        let count: number = 1;
        return this._dataService.Query()
            .Expand('Department($select=DepartmentId,DepartmentName),User($select=Email,UserProfileId,UserId)')
            .Filter(`DepartmentId eq ${departmentId}`)
            .OrderBy('CreatedOn desc')
            .Execute();
            //.flatMap((data: Observable<NotifyPeopleModel[]>)=>this.GetSubDepartments(departmentId))
            
            // .flatMap((data: NotifyPeopleModel[])=> this.GetSubDepartments(departmentId))
            // .map((childDepartments: ResponseModel<DepartmentModel>) => {
            //     debugger;
            //     console.log(childDepartments);
            //     childDepartments.Records.forEach((item: DepartmentModel, index: number) => {
            //         if (index == 0) {
            //             allChildDepartmentIdsProjection = `DepartmentId eq ${item.DepartmentId}`;
            //         }
            //         else {
            //             allChildDepartmentIdsProjection = allChildDepartmentIdsProjection + `or DepartmentId eq ${item.DepartmentId}`;
            //         }
            //     });
            //     return this.allDepartmentUserPermission;
            // })
            // .flatMap((data: ResponseModel<NotifyPeopleModel>) => this.GetUserPermissionFromDepartments(allChildDepartmentIdsProjection))
            // .map((userPermissions: ResponseModel<UserPermissionModel>) => {
            //     debugger;
            //     console.log(userPermissions);
            //     let notifyModel: NotifyPeopleModel = new NotifyPeopleModel();
            //     count = count + 1;
            //     notifyModel.id = count;
            //     notifyModel.text = userPermissions.Records[0].Department.DepartmentName;
            //     notifyModel.population = '';
            //     notifyModel.checked = false;
            //     userPermissions.Records.forEach((item: UserPermissionModel, index: number) => {
            //         let notifyModelInner: NotifyPeopleModel = new NotifyPeopleModel();
            //         count = count + 1;
            //         notifyModelInner.id = count;
            //         notifyModelInner.text = item.User.Email;
            //         notifyModelInner.population = '';
            //         notifyModelInner.checked = false;
            //         notifyModel.children.push(notifyModelInner);
            //     });
            //     this.allDepartmentUserPermission.push(notifyModel);
            //     return this.allDepartmentUserPermission;
            // })
    }

    public GetAllSubDepartments(departmentId: number): Observable<ResponseModel<DepartmentModel>>{
        return this.departmentService.GetAllActiveSubDepartments(departmentId);
    }



    

    public GetUserPermissionFromDepartments(allChildDepartmentIdsProjection: string): Observable<ResponseModel<UserPermissionModel>> {
        debugger;
        return this._dataService.Query()
            .Expand('Department($select=DepartmentId,DepartmentName),User($select=Email,UserProfileId,UserId)')
            .Filter(`${allChildDepartmentIdsProjection}`)
            .OrderBy("CreatedOn desc")
            .Execute()
    }
}