import { Injectable, Inject } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { AffectedModel } from './affected.model';
import {
    IServiceInretface,
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService
} from '../../../../shared';
import {
    InvolvePartyService,
    InvolvePartyModel
} from '../../../shared.components';

@Injectable()
export class AffectedService implements IServiceInretface<AffectedModel> {
    private _dataService: DataService<AffectedModel>;

    constructor(private dataServiceFactory: DataServiceFactory,
        private involvedPartyService: InvolvePartyService) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<AffectedModel>('Affecteds', option);
    }

    GetAll(): Observable<ResponseModel<AffectedModel>> {
        return this._dataService.Query()
            .Expand('InvolvedParty($select=IncidentId,InvolvedPartyType,InvolvedPartyDesc)')
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    Get(id: string | number): Observable<AffectedModel> {
        return this._dataService.Get(id.toString()).Execute();
    }

    Create(entity: AffectedModel): Observable<AffectedModel> {
        let affected: AffectedModel;
        return this._dataService.Post(entity)
            .Execute()
            .map((data: AffectedModel) => {
                affected = data;
                affected.Active = (affected.ActiveFlag == 'Active');
                return data;
            })
            .flatMap((data: AffectedModel) =>
                this.involvedPartyService.Get(data.InvolvedPartyId))
            .map((data: InvolvePartyModel) => {
                affected.InvolvedParty = data;
                return affected;
            });
    }

    CreateBulk(entities: AffectedModel[]): Observable<AffectedModel[]> {
        return Observable.of(entities);
    }

    Update(entity: AffectedModel): Observable<AffectedModel> {
        let key: string = entity.InvolvedPartyId.toString()
        let affected: AffectedModel;
        return this._dataService.Patch(entity, key)
            .Execute();
    }

    Delete(entity: AffectedModel): void {
    }


    GetAllActiveAffecteds(): Observable<ResponseModel<AffectedModel>> {
        return this._dataService.Query()
            .Select('AffectedId', 'InvolvedPartyId', 'Severity')
            .Filter("ActiveFlag eq 'Active'")
            .OrderBy("CreatedOn desc")
            .Execute();
    }
}