import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { EmergencyLocationModel } from './emergencylocation.model';
import { IEmergencyLocationService } from './IEmergencyLocationService';
import {
    ResponseModel,
    DataServiceFactory,
    ServiceBase
} from '../../../../shared';

@Injectable()
export class EmergencyLocationService extends ServiceBase<EmergencyLocationModel>
    implements IEmergencyLocationService {

    /**
     * Creates an instance of EmergencyLocationService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf EmergencyLocationService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'EmergencyLocations')
    }

    GetAllActive(): Observable<ResponseModel<EmergencyLocationModel>> {
        return this._dataService.Query()
            .Filter("ActiveFlag eq 'Active'")
            .OrderBy("CreatedOn desc")
            .Execute();
    }

     GetAllEmergencyLocations(): Observable<ResponseModel<EmergencyLocationModel>> {
        return this._dataService.Query()            
            .OrderBy("IATA asc")
            .Execute();
    }

    GetAllActiveEmergencyLocations(): Observable<ResponseModel<EmergencyLocationModel>> {
        return this._dataService.Query()
            .Select('EmergencyLocationId', 'City', 'IATA','AirportName', 'CreatedBy', 'CreatedOn')
            .Filter("ActiveFlag eq 'Active'")
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    CreateEmergencyLocation(entity: EmergencyLocationModel): Observable<EmergencyLocationModel> {
        let emergencyLocation: EmergencyLocationModel;
        return this._dataService.Post(entity).Execute()
            .map((data: EmergencyLocationModel) => {
                emergencyLocation = data;
                emergencyLocation.Active = (emergencyLocation.ActiveFlag == 'Active');
                return data;
            });
    }

     GetQuery(query: string): Observable<ResponseModel<EmergencyLocationModel>> {
        return this._dataService.Query()
            .Filter(query).Execute();
    }
    
}