import { Injectable, Output, EventEmitter } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { EmergencyDepartmentModel } from './emergency.department.model';
import {
    ResponseModel, GlobalConstants,
    DataService, DataServiceFactory,
    DataOperation, DataProcessingService,
    IServiceInretface,
} from '../../../../shared';


@Injectable()
export class EmergencyTypeDepartmentService implements IServiceInretface<EmergencyDepartmentModel> {
    private _dataService: DataService<EmergencyDepartmentModel>;
    private _bulkDataService: DataService<EmergencyDepartmentModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<EmergencyDepartmentModel>('EmergencyTypeDepartments', option);

        this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptions<EmergencyDepartmentModel>('EmergencyTypeDepartmentBatch/BatchPostAsync', option);
    }

    GetAll(): Observable<ResponseModel<EmergencyDepartmentModel>> {
        return this._dataService.Query().Execute();
    }

    GetFilterByEmergencyType(emergencyTypeId: number): Observable<ResponseModel<EmergencyDepartmentModel>> {
        return this._dataService.Query()
            .Filter(`EmergencyTypeId eq ${emergencyTypeId}`)
            .Execute();
    }

    Get(id: string | number): Observable<EmergencyDepartmentModel> {
        return this._dataService.Get(id.toString()).Execute();
    }

    Create(entity: EmergencyDepartmentModel): Observable<EmergencyDepartmentModel> {
        return Observable.of(entity);
    }

    CreateBulk(entities: EmergencyDepartmentModel[]): Observable<EmergencyDepartmentModel[]> {
        return this._bulkDataService.BulkPost(entities).Execute();
    }

    Update(entity: EmergencyDepartmentModel): Observable<EmergencyDepartmentModel> {
        return Observable.of(entity);
    }

    Delete(entity: EmergencyDepartmentModel): void {
    }






    // GetAllDepartmentsWithEmergencyTypes(emergencyTypeId): Observable<ResponseModel<EmergencyDepartmentModel>> {
    //     return this._dataService.Query().Filter('EmergencyTypeId eq ' + emergencyTypeId)
    //         .Execute();
    // }

    // CreateDepartmentsWithEmergencyTypes(emergencyTypeDepartmentModels: EmergencyDepartmentModel[]): Observable<EmergencyDepartmentModel[]> {

    //     return this._dataServiceAPI.BulkPost(emergencyTypeDepartmentModels)
    //         .Execute();
    // }


}