import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ChecklistModel } from './checklist.model';
import {
    IServiceInretface,
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService
} from '../../../../shared';
import { DepartmentService, DepartmentModel } from '../../department';
import { EmergencyTypeModel, EmergencyTypeService } from '../../emergencytype';

@Injectable()
export class ChecklistService implements IServiceInretface<ChecklistModel> {
    private _dataService: DataService<ChecklistModel>;

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
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<ChecklistModel>('CheckLists', option);
    }

    GetAll(): Observable<ResponseModel<ChecklistModel>> {
        return this._dataService.Query()
            .Expand('ParentCheckList($select=CheckListId,CheckListCode)',
            'TargetDepartment($select=DepartmentId,DepartmentName)',
            'EmergencyType($select=EmergencyTypeId,EmergencyTypeName)')
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    Get(id: string | number): Observable<ChecklistModel> {
        return this._dataService.Get(id.toString()).Execute();
    }

    Create(entity: ChecklistModel): Observable<ChecklistModel> {
        let checkList: ChecklistModel;
        return this._dataService.Post(entity)
            .Execute()
            .map((data: ChecklistModel) => {
                checkList = data;
                if (checkList.ActiveFlag == 'Active') {
                    checkList.Active = true;
                }
                else {
                    checkList.Active = false;
                }
                return data;
            })
            .flatMap((data: ChecklistModel) =>
                this.departmentService.Get(data.DepartmentId))
            .map((data: DepartmentModel) => {
                checkList.TargetDepartment = data;
                return checkList;
            })
            .flatMap((data: ChecklistModel) =>
                this.Get(data.ParentCheckListId))
            .map((data: ChecklistModel) => {
                checkList.ParentCheckList = data;
                return checkList;
            })
            .flatMap((data: ChecklistModel) =>
                this.emergencyTypeService.Get(data.EmergencyTypeId))
            .map((data: EmergencyTypeModel) => {
                checkList.EmergencyType = data;
                return checkList;
            });
    }

    CreateBulk(entities: ChecklistModel[]): Observable<ChecklistModel[]> {
        return Observable.of(entities);
    }

    Update(entity: ChecklistModel): Observable<ChecklistModel> {
        let key: string = entity.CheckListId.toString()
        let checkList: ChecklistModel;
        return this._dataService.Patch(entity, key)
            .Execute();
    }

    Delete(entity: ChecklistModel): void {
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
            .Filter("ActiveFlag eq 'Active'")
            .OrderBy("CreatedOn desc")
            .Execute();
    }
}