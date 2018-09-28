import { Injectable, Inject } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AffectedModel } from './affected.model';
import { IAffectedService } from './IAffectedService';
import {
    ServiceBase,
    ResponseModel,
    DataServiceFactory
} from '../../../../shared';
import { InvolvePartyService, InvolvePartyModel } from '../../involveparties';


@Injectable()

export class AffectedService extends ServiceBase<AffectedModel> implements IAffectedService {

    /**
     * Creates an instance of AffectedService.
     * @param {DataServiceFactory} dataServiceFactory 
     * @param {InvolvePartyService} involvedPartyService 
     * 
     * @memberOf AffectedService
     */
    constructor(private dataServiceFactory: DataServiceFactory,
        private involvedPartyService: InvolvePartyService) {
            super(dataServiceFactory, 'Affecteds');
    }

    GetAll(): Observable<ResponseModel<AffectedModel>> {
        return this._dataService.Query()
            .Expand('InvolvedParty($select=IncidentId,InvolvedPartyType,InvolvedPartyDesc)')
            .OrderBy("CreatedOn desc")
            .Execute();
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

    GetAllActiveAffecteds(): Observable<ResponseModel<AffectedModel>> {
        return this._dataService.Query()
            .Select('AffectedId', 'InvolvedPartyId', 'Severity')
            .Filter("ActiveFlag eq 'Active'")
            .OrderBy("CreatedOn desc")
            .Execute();
    }
}