import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { CoPassengerMappingModel, PassengerModel, CoPassangerModelsGroupIdsModel } from './passenger.model';
import { IPassengerService } from './IPassengerService';
import {
    ResponseModel,
    DataServiceFactory, DataService, DataProcessingService,
    ServiceBase, UtilityService
} from '../../../../shared';

@Injectable()
export class PassengerService extends ServiceBase<PassengerModel> {
    private _bulkDataService: DataService<PassengerModel>;

    private _bulkDataServiceForUpdate: DataService<PassengerModel>;

    /**
     * Creates an instance of DepartmentService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf DepartmentService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'Passengers');
        let option: DataProcessingService = new DataProcessingService();
        
    }


   
    public SavePassenger(entities: PassengerModel): Observable<PassengerModel> {
        return this._dataService.Post(entities)
            .Execute();
    }

    // public setcopassangers(entities: CoPassengerMappingModel[]): Observable<CoPassengerMappingModel[]> {
    //     let option: DataProcessingService = new DataProcessingService();
    //     let setcopassangerdataservice: DataService<CoPassengerMappingModel> = this.dataServiceFactory
    //         .CreateServiceWithOptionsAndActionSuffix<CoPassengerMappingModel>
    //         ('CoPassengerMappingBatch', 'BatchPostAsync', option);
    //     return setcopassangerdataservice.BulkPost(entities).Execute();
    // };

    // public deleteoldgroups(groupid : number): Observable<CoPassengerMappingModel[]> {
    //      let option: DataProcessingService = new DataProcessingService();
    //     let setcopassangerdataservice: DataService<CoPassengerMappingModel> = this.dataServiceFactory
    //         .CreateServiceWithOptionsAndActionSuffix<CoPassengerMappingModel>
    //         ('CoPassengerMappingBatch', `BatchDeleteCoPassangers/${groupid}`, option);
    //     return setcopassangerdataservice.JsonPost(groupid).Execute();
    // };

    // public updatecopassangerstogroup(entities: CoPassengerMappingModel[]): Observable<CoPassengerMappingModel[]> {
    //      let option: DataProcessingService = new DataProcessingService();
    //     let setcopassangerdataservice: DataService<CoPassengerMappingModel> = this.dataServiceFactory
    //         .CreateServiceWithOptionsAndActionSuffix<CoPassengerMappingModel>
    //         ('CoPassengerMappingBatch', 'BatchUpdateCoPassangersToGroupAsync', option);
    //     return setcopassangerdataservice.BulkPost(entities).Execute();
    // };

    // public deleteoldgroupsandupdatecopassanger(entity: CoPassangerModelsGroupIdsModel): Observable<CoPassengerMappingModel[]> {
    //      let option: DataProcessingService = new DataProcessingService();
    //     let setcopassangerdataservice: DataService<any> = this.dataServiceFactory
    //         .CreateServiceWithOptionsAndActionSuffix('CoPassengerMappingBatch', 'BatchDeleteOldGroupsUpdateCoPassangers', option);
    //     return setcopassangerdataservice.JsonPost(entity).Execute();
    // };

    // public deleteoldgroupsandaddcopassanger(entity: CoPassangerModelsGroupIdsModel): Observable<CoPassengerMappingModel[]> {
    //      let option: DataProcessingService = new DataProcessingService();
    //     let setcopassangerdataservice: DataService<any> = this.dataServiceFactory
    //         .CreateServiceWithOptionsAndActionSuffix('CoPassengerMappingBatch', 'BatchDeleteOldGroupsAddCoPassangers', option);
    //     return setcopassangerdataservice.JsonPost(entity).Execute();
    // };
}