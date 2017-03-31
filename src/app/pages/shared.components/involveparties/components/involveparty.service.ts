import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { InvolvePartyModel } from './involveparty.model';
import { IInvolvePartyService } from './IInvolvePartyService';
import {
    IServiceInretface,
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService,
    ServiceBase
} from '../../../../shared';
import {
    IncidentService,
    IncidentModel
} from '../../../incident';

@Injectable()
export class InvolvePartyService
    extends ServiceBase<InvolvePartyModel>
    implements IInvolvePartyService {
    private _incidentDataService: DataService<IncidentModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'InvolvedParties');
    }

    GetAll(): Observable<ResponseModel<InvolvePartyModel>> {
        return this._dataService.Query()
            .Expand('Incident($select=EmergencyName,IncidentStatus,EmergencyTypeId,EmergencyLocation,ActiveFlag)')
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    Create(entity: InvolvePartyModel): Observable<InvolvePartyModel> {
        let involvedParty: InvolvePartyModel;

        return this._dataService.Post(entity)
            .Execute()
            .map((data: InvolvePartyModel) => {
                involvedParty = data;
                return data;
            })
            .flatMap((data: InvolvePartyModel) =>
                this.GetIncidentById(data.IncidentId)
            )
            .map((data: IncidentModel) => {
                involvedParty.Incident = data;
                return involvedParty;
            });
    }

    GetAllActiveInvolvedParties(): Observable<ResponseModel<InvolvePartyModel>> {
        return this._dataService.Query()
            .Select('InvolvedPartyId', 'InvolvedPartyDesc')
            .Filter("ActiveFlag eq 'Active'")
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    GetIncidentById(id: string | number): Observable<IncidentModel> {
        return this._incidentDataService.Get(id.toString()).Execute();
    }

}