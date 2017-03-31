import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { EmergencyTypeModel } from './emergencytype.model';
import { ResponseModel } from '../../../../shared/models';
import {
    DataService,
    DataServiceFactory,
    DataProcessingService,
    IServiceInretface,
    ServiceBase
} from '../../../../shared/services';

@Injectable()
export class EmergencyTypeService extends ServiceBase<EmergencyTypeModel> {
    

    /**
     * Creates an instance of EmergencyTypeService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf EmergencyTypeService
     */
    private _emergencyTypes: ResponseModel<EmergencyTypeModel>;
    constructor(dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'EmergencyTypes');
    }   

    GetAll(): Observable<ResponseModel<EmergencyTypeModel>> {
        return this._dataService.Query()
            .Execute()
            .map((emergencyTypes: ResponseModel<EmergencyTypeModel>) => {
                this._emergencyTypes = emergencyTypes;
                
                this._emergencyTypes.Records.forEach(element => {
                    element.Active = (element.ActiveFlag == 'Active');
                });
                return emergencyTypes;
            });
    }
   
}