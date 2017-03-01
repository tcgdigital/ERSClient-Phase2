import { Injectable, Output, EventEmitter } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { InvolvedPartyModel } from '../../InvolvedParty';
import { AffectedModel } from '../../affecteds';
import { AffectedObjectModel, AffectedObjectsToView } from './affected.objects.model';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService,
    IServiceInretface, UtilityService
} from '../../../../shared';

@Injectable()
export class AffectedObjectsService {
    private _dataService: DataService<InvolvedPartyModel>;
 private _bulkDataService: DataService<AffectedObjectModel>;
    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<InvolvedPartyModel>('InvolvedParties', option);
         this._bulkDataService = this.dataServiceFactory
       .CreateServiceWithOptions<AffectedObjectModel>('AffectedObjectBatch', option);
    }

    GetAll(): Observable<ResponseModel<InvolvedPartyModel>> {
        return this._dataService.Query()
            .Expand('Affecteds($expand=AffectedObjects($expand=Cargo))')
            .Execute();
    }
    GetFilterByIncidentId(): Observable<ResponseModel<InvolvedPartyModel>> {
        return this._dataService.Query()
            .Filter('IncidentId eq ' + '88')
            .Expand('Affecteds($expand=AffectedObjects($expand=Cargo))')
            .Execute();
    }

    FlattenData(involvedParty: InvolvedPartyModel): any {
        let affectedObjectsToView: AffectedObjectsToView[];
        let affectedObjects: AffectedObjectModel[];
        let affected: AffectedModel;
        affected = UtilityService.pluck(involvedParty, ['Affecteds'])[0][0];
        affectedObjects = UtilityService.pluck(affected, ['AffectedObjects'])[0];
        affectedObjectsToView = affectedObjects.map(function (data) {
            let item = new AffectedObjectsToView();
            item.AffectedId = data.AffectedId;
            item.AffectedObjectId = data.AffectedObjectId;
            item.TicketNumber = data.TicketNumber;
            item.CargoId = data.Cargo.CargoId;
            item.AWB = data.AWB;
            item.POL = data.Cargo.POL;
            item.POU = data.Cargo.POU;
            item.mftpcs = data.Cargo.mftpcs;
            item.mftwgt = data.Cargo.mftwgt;
            item.IsVerified = data.IsVerified;
            item.Details = data.Cargo.Details;
            // item.CommunicationLogs: data.CommunicationLogs
            return item;
        });
        return affectedObjectsToView;

    }

    Get(id: string | number): Observable<InvolvedPartyModel> {
        return this._dataService.Get(id.toString()).Execute();
    }

    Create(entity: InvolvedPartyModel): Observable<InvolvedPartyModel> {
        return this._dataService.Post(entity).Execute();
    }

    CreateBulk(entities: AffectedObjectModel[]): Observable<AffectedObjectModel[]> {
        return this._bulkDataService.BulkPost(entities).Execute();       
    }

    Update(entity: InvolvedPartyModel): Observable<InvolvedPartyModel> {
        return Observable.of(entity);
    }

    Delete(entity: InvolvedPartyModel): void {
    }
}
