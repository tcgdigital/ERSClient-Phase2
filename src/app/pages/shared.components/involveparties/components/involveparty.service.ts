import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { InvolvePartyModel } from './involveparty.model';
import {
    IServiceInretface,
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService
} from '../../../../shared';
import { IncidentService, IncidentModel } from '../../../incident';

@Injectable()
export class InvolvePartyService implements IServiceInretface<InvolvePartyModel> {
    private _dataService: DataService<InvolvePartyModel>;


    constructor(private dataServiceFactory: DataServiceFactory,
        private incidentService: IncidentService) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<InvolvePartyModel>('InvolvedParties', option);
    }

    GetAll(): Observable<ResponseModel<InvolvePartyModel>> {
        return this._dataService.Query()
            .Expand('Incident($select=EmergencyName,IncidentStatus,EmergencyTypeId,EmergencyLocation,ActiveFlag)')
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    Get(id: string | number): Observable<InvolvePartyModel> {
        return this._dataService.Get(id.toString()).Execute();
    }

    Create(entity: InvolvePartyModel): Observable<InvolvePartyModel> {
        let involvedParty: InvolvePartyModel;
        return this._dataService.Post(entity)
            .Execute()
            .map((data: InvolvePartyModel) => {
                involvedParty = data;
                if (involvedParty.ActiveFlag == 'Active') {
                    involvedParty.Active = true;
                }
                else {
                    involvedParty.Active = false;
                }
                return data;
            })
            .flatMap((data: InvolvePartyModel) =>
                this.incidentService.Get(data.IncidentId))
            .map((data: IncidentModel) => {
                involvedParty.Incident = data;
                return involvedParty;
            });
    }

    CreateBulk(entities: InvolvePartyModel[]): Observable<InvolvePartyModel[]> {
        return Observable.of(entities);
    }

    Update(entity: InvolvePartyModel): Observable<InvolvePartyModel> {
        let key: string = entity.InvolvedPartyId.toString()
        let involvedParty: InvolvePartyModel;
        return this._dataService.Patch(entity, key)
            .Execute();
    }

    Delete(entity: InvolvePartyModel): void {
    }


    CreateInvolvedParty(involvedPartyModel: InvolvePartyModel): Observable<InvolvePartyModel> {
        let involvedParty: InvolvePartyModel;
        return this._dataService.Post(involvedPartyModel)
            .Execute()
            .map((data: InvolvePartyModel) => {
                involvedParty = data;
                if (involvedParty.ActiveFlag == 'Active') {
                    involvedParty.Active = true;
                }
                else {
                    involvedParty.Active = false;
                }
                return data;
            });
        // .flatMap((data: InvolvedPartyModel) => this.incidentService.GetIncidentById(data.IncidentId))
        // .map((data: IncidentModel) => {
        //     involvedParty.Incident = data;
        //     return involvedParty;
        // });
    }

    GetAllActiveInvolvedParties(): Observable<ResponseModel<InvolvePartyModel>> {
        return this._dataService.Query()
            .Select('InvolvedPartyId', 'InvolvedPartyDesc')
            .Filter("ActiveFlag eq 'Active'")
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    GetInvolvedPartyById(id: number): Observable<InvolvePartyModel> {
        return this._dataService.Get(id.toString())
            .Execute();
    }
}