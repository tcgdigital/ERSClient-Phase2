import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { CoPassengerMappingModel, PassengerModel } from './passenger.model';
import { IPassengerService } from './IPassengerService';
import {
    ResponseModel,
    DataServiceFactory,
    ServiceBase, UtilityService
} from '../../../../shared';

@Injectable()
export class PassengerService extends ServiceBase<CoPassengerMappingModel>
    implements IPassengerService {

    /**
     * Creates an instance of DepartmentService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf DepartmentService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'CoPassengerMappings');
    }


     getGroupId(PassengerId: number):Observable<ResponseModel<CoPassengerMappingModel>>{
          return  this._dataService.Query()
            .Filter(`PassengerId eq ${PassengerId}`)
            .Select('GroupId')
            .Execute();
     }
      getCoPassengers(GroupId: number):Observable<ResponseModel<CoPassengerMappingModel>>{
          return  this._dataService.Query()
            .Filter(`GroupId eq ${GroupId}`)
            .Expand('Passenger')
            .Execute();
     }
    }