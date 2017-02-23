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

    /**
     * Creates an instance of EmergencyTypeDepartmentService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf EmergencyTypeDepartmentService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<EmergencyDepartmentModel>('EmergencyTypeDepartments', option);

        this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<EmergencyDepartmentModel>
            ('EmergencyTypeDepartmentBatch', 'BatchPostAsync', option);
    }

    /**
     * Get all EmergencyDepartmentModel
     * 
     * @returns {Observable<ResponseModel<EmergencyDepartmentModel>>} 
     * 
     * @memberOf EmergencyTypeDepartmentService
     */
    GetAll(): Observable<ResponseModel<EmergencyDepartmentModel>> {
        return this._dataService.Query().Execute();
    }

    /**
     * Get EmergencyDepartmentModel by emergencyTypeId
     * 
     * @param {number} emergencyTypeId 
     * @returns {Observable<ResponseModel<EmergencyDepartmentModel>>} 
     * 
     * @memberOf EmergencyTypeDepartmentService
     */
    GetFilterByEmergencyType(emergencyTypeId: number): Observable<ResponseModel<EmergencyDepartmentModel>> {
        return this._dataService.Query()
            .Filter(`EmergencyTypeId eq ${emergencyTypeId}`)
            .Execute();
    }

    /**
     * Get EmergencyDepartmentModel by id
     * 
     * @param {(string | number)} id 
     * @returns {Observable<EmergencyDepartmentModel>} 
     * 
     * @memberOf EmergencyTypeDepartmentService
     */
    Get(id: string | number): Observable<EmergencyDepartmentModel> {
        return this._dataService.Get(id.toString()).Execute();
    }

    /**
     * Create EmergencyDepartmentModel
     * 
     * @param {EmergencyDepartmentModel} entity 
     * @returns {Observable<EmergencyDepartmentModel>} 
     * 
     * @memberOf EmergencyTypeDepartmentService
     */
    Create(entity: EmergencyDepartmentModel): Observable<EmergencyDepartmentModel> {
        return Observable.of(entity);
    }

    /**
     * Create bulk EmergencyDepartmentModels
     * 
     * @param {EmergencyDepartmentModel[]} entities 
     * @returns {Observable<EmergencyDepartmentModel[]>} 
     * 
     * @memberOf EmergencyTypeDepartmentService
     */
    CreateBulk(entities: EmergencyDepartmentModel[]): Observable<EmergencyDepartmentModel[]> {
        return this._bulkDataService.BulkPost(entities).Execute();
    }

    /**
     * Update EmergencyDepartmentModel
     * 
     * @param {EmergencyDepartmentModel} entity 
     * @returns {Observable<EmergencyDepartmentModel>} 
     * 
     * @memberOf EmergencyTypeDepartmentService
     */
    Update(entity: EmergencyDepartmentModel): Observable<EmergencyDepartmentModel> {
        return Observable.of(entity);
    }

    /**
     * 
     * 
     * @param {EmergencyDepartmentModel} entity 
     * 
     * @memberOf EmergencyTypeDepartmentService
     */
    Delete(entity: EmergencyDepartmentModel): void {
    }
}