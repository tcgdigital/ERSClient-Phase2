import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { CoPassengerMappingModel, PassengerModel } from './passenger.model';
import { IPassengerService } from './IPassengerService';
import {
    ResponseModel,
    DataServiceFactory, DataService, DataProcessingService,
    ServiceBase, UtilityService
} from '../../../../shared';

@Injectable()
export class PassengerService extends ServiceBase<CoPassengerMappingModel>
    implements IPassengerService {
    private _bulkDataService: DataService<CoPassengerMappingModel>;

    private _bulkDataServiceForUpdate : DataService<CoPassengerMappingModel>;

    /**
     * Creates an instance of DepartmentService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf DepartmentService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'CoPassengerMappings');
        let option: DataProcessingService = new DataProcessingService();
        this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<CoPassengerMappingModel>
            ('CoPassengerMappingBatch', 'BatchPostAsync', option);

         this._bulkDataServiceForUpdate = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<CoPassengerMappingModel>
            ('CoPassengerMappingBatch', 'BatchUpdateAsync', option);
    }


    getGroupId(PassengerId: number): Observable<ResponseModel<CoPassengerMappingModel>> {
        return this._dataService.Query()
            .Filter(`PassengerId eq ${PassengerId}`)
            .Select('GroupId')
            .Execute();
    }
    getCoPassengers(GroupId: number): Observable<ResponseModel<CoPassengerMappingModel>> {
        return this._dataService.Query()
            .Filter(`GroupId eq ${GroupId}`)
            .Expand('Passenger')
            .Execute();
    }

    public setcopassangers(entities: CoPassengerMappingModel[]): Observable<CoPassengerMappingModel[]> {
        return this._bulkDataService.BulkPost(entities).Execute();
    };

    public updatecopassangers(entities: CoPassengerMappingModel[]): Observable<CoPassengerMappingModel[]> {
        return this._bulkDataServiceForUpdate.BulkPost(entities).Execute();
    };
}