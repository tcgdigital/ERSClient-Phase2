import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ChecklistModel } from './checklist.model';
import { IChecklistService } from './IChecklistService';
import {
    IServiceInretface,
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService, ServiceBase
} from '../../../../shared';
import { DepartmentService, DepartmentModel } from '../../department';
import { EmergencyTypeModel, EmergencyTypeService } from '../../emergencytype';
import { PeopleOnBoardWidgetService } from '../../../widgets';

@Injectable()
export class ChecklistService extends ServiceBase<ChecklistModel> implements IChecklistService {

    /**
     * Creates an instance of ChecklistService.
     * @param {DataServiceFactory} dataServiceFactory
     * @param {DepartmentService} departmentService
     * @param {EmergencyTypeService} emergencyTypeService
     *
     * @memberOf ChecklistService
     */
    constructor(private dataServiceFactory: DataServiceFactory,
        private departmentService: DepartmentService,
        private emergencyTypeService: EmergencyTypeService) {
        super(dataServiceFactory, 'CheckLists');
    }

    GetAllByDepartment(departmentId): Observable<ResponseModel<ChecklistModel>> {
        return this._dataService.Query()
            .Filter(`DepartmentId eq ${departmentId}`)
            .Expand('TargetDepartment($select=DepartmentId,DepartmentName)',
            'EmergencyType($select=EmergencyTypeId,EmergencyTypeName)',
            'Organization', 'CheckListParent($expand=TargetDepartment($select=DepartmentId,DepartmentName))', 'CheckListChildren')
            .OrderBy('CreatedOn desc')
            .Execute();
    }

    GetAllParents(): Observable<ResponseModel<ChecklistModel>> {
        return this._dataService.Query()
            .Filter(`ActiveFlag eq 'Active'`)
            .Expand('TargetDepartment($select=DepartmentId,DepartmentName)')
            .Execute();

    }

    GetQuery(query: string): Observable<ResponseModel<ChecklistModel>> {
        return this._dataService.Query()
            .Expand('TargetDepartment($select=DepartmentId,DepartmentName)',
            'EmergencyType($select=EmergencyTypeId,EmergencyTypeName)')
            .Filter(query).Execute();
    }


    Create(entity: ChecklistModel): Observable<ChecklistModel> {
        let checkList: ChecklistModel;
        return this._dataService.Post(entity)
            .Execute()
            .map((data: ChecklistModel) => {
                checkList = data;
                checkList.Active = (checkList.ActiveFlag === 'Active');
                return data;
            })
            .flatMap((data: ChecklistModel) =>
                this.departmentService.Get(data.DepartmentId))
            .map((data: DepartmentModel) => {
                checkList.TargetDepartment = data;
                return checkList;
            })
            .flatMap((data: ChecklistModel) =>
                this.emergencyTypeService.Get(data.EmergencyTypeId))
            .map((data: EmergencyTypeModel) => {
                checkList.EmergencyType = data;
                return checkList;
            });
    }

    Update(entity: ChecklistModel): Observable<ChecklistModel> {
        const key: string = entity.CheckListId.toString();
        // const checkList: ChecklistModel;
        return this._dataService.Patch(entity, key).Execute();
    }

    /**
     * Get all active check lists
     *
     * @returns {Observable<ResponseModel<ChecklistModel>>}
     *
     * @memberOf ChecklistService
     */
    GetAllActiveCheckLists(): Observable<ResponseModel<ChecklistModel>> {
        return this._dataService.Query()
            .Select('CheckListId', 'CheckListCode')
            .Filter(`ActiveFlag eq 'Active'`)
            .Expand('CheckListParent($expand=TargetDepartment($select=DepartmentId,DepartmentName))','TargetDepartment')
            .OrderBy('CreatedOn desc')
            .Execute();
    }

    GetParentChecklistCode(parentchecklistId): Observable<ResponseModel<ChecklistModel>> {
        return this._dataService.Query()
            .Select('CheckListCode')
            .Filter(`CheckListId eq ${parentchecklistId}`)
            .Execute();
    }
}