import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { EmergencySituationModel } from './emergencysituation.model';
import { IEmergencySituationService } from './IEmergencySituationService';
import {
    ResponseModel,
    DataServiceFactory,
    ServiceBase
} from '../../../../shared';

@Injectable()
export class EmergencySituationService extends ServiceBase<EmergencySituationModel>
    implements IEmergencySituationService {

    /**
     * Creates an instance of EmergencySituationService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf EmergencySituationService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'EmergencySituations')
    }

    GetAll(): Observable<ResponseModel<EmergencySituationModel>> {
        return this._dataService.Query()
            .Filter("ActiveFlag eq 'Active'")
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    GetAllActiveEmergencySituations(): Observable<ResponseModel<EmergencySituationModel>> {
        return this._dataService.Query()
            .Select('EmergencySituationId', 'EmergencySituationName', 'ActiveFlag', 'CreatedBy', 'CreatedOn')
            .Filter("ActiveFlag eq 'Active'")
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    Create(entity: EmergencySituationModel): Observable<EmergencySituationModel> {
        let emergencySituation: EmergencySituationModel;
        return this._dataService.Post(entity).Execute()
            .map((data: EmergencySituationModel) => {
                emergencySituation = data;
                emergencySituation.Active = (emergencySituation.ActiveFlag == 'Active');
                return data;
            });
    }
}