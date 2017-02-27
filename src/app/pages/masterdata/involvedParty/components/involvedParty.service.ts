import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { InvolvedPartyModel } from './involvedParty.model';
import { ResponseModel,DataService,DataServiceFactory,DataProcessingService } from '../../../../shared';
import { IncidentService,IncidentModel } from '../../incident';

@Injectable()
export class InvolvedPartyService {
    private _dataService: DataService<InvolvedPartyModel>;

    constructor(private dataServiceFactory: DataServiceFactory
    ) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<InvolvedPartyModel>('InvolvedParties', option);
    }

    GetAllInvolvedParties(): Observable<ResponseModel<InvolvedPartyModel>> {
        debugger;
        return this._dataService.Query()
            .Expand('Incident($select=IncidentId,EmergencyName)')
            .OrderBy("CreatedOn desc")
            .Execute();
    }
    GetAllActiveInvolvedParties(): Observable<ResponseModel<InvolvedPartyModel>> {
        debugger;
        return this._dataService.Query()
            .Select('InvolvedPartyId', 'InvolvedPartyType')
            .Filter("ActiveFlag eq 'Active'")
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    CreateInvolvedParty(involvedPartyModel: InvolvedPartyModel): Observable<InvolvedPartyModel> {
        let involvedParty: InvolvedPartyModel;
        return this._dataService.Post(involvedPartyModel)
            .Execute()
            .map((data: InvolvedPartyModel) => {
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

    EditInvolvedParty(involvedPartyModel: InvolvedPartyModel): Observable<InvolvedPartyModel> {
        let key: string = involvedPartyModel.InvolvedPartyId.toString()
        let involvedParty: InvolvedPartyModel;
        return this._dataService.Patch(involvedPartyModel, key)
            .Execute();

    }

    GetInvolvedPartyById(id: number): Observable<InvolvedPartyModel> {
        return this._dataService.Get(id.toString())
            .Execute();
    }
}