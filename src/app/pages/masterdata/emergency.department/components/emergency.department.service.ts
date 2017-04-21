import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { EmergencyDepartmentModel } from './emergency.department.model';
import { IEmergencyTypeDepartmentService } from './IEmergencyTypeDepartmentService';
import {
    ResponseModel,
    DataService, DataServiceFactory,
    DataProcessingService,
    ServiceBase
} from '../../../../shared';


@Injectable()
export class EmergencyTypeDepartmentService extends ServiceBase<EmergencyDepartmentModel>
    implements IEmergencyTypeDepartmentService {
    private _bulkDataService: DataService<EmergencyDepartmentModel>;

    /**
     * Creates an instance of EmergencyTypeDepartmentService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf EmergencyTypeDepartmentService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'EmergencyTypeDepartments');
        let option: DataProcessingService = new DataProcessingService();

        this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<EmergencyDepartmentModel>
            ('EmergencyTypeDepartmentBatch', 'BatchPostAsync', option);
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

    GetFilterByEmergencyTypeDepartmentId(emergencyTypeId: number): Observable<ResponseModel<EmergencyDepartmentModel>> {
        return this._dataService.Query()
            .Expand(`Department`)
            .Select('Department/DepartmentId')
            .Filter(`EmergencyTypeId eq ${emergencyTypeId}`)
            .Execute();
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
}