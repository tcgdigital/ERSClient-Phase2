import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { IncidentModel } from './incident.model';
import { IIncidentService } from './IIncidentService';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService, ServiceBase
} from '../../../shared';
import { DepartmentService, EmergencyTypeService } from '../../masterdata';
import {
    FlightModel, FlightService, InvolvePartyModel
} from '../../shared.components';

@Injectable()
export class IncidentService extends ServiceBase<IncidentModel> implements IIncidentService {

    private _involvePartyDataService: DataService<InvolvePartyModel>;

    constructor(private dataServiceFactory: DataServiceFactory,
        private departmentService: DepartmentService,
        private flightService: FlightService,
        private emergencyTypeService: EmergencyTypeService) {
        super(dataServiceFactory, 'Incidents');
        let option = new DataProcessingService();
        this._involvePartyDataService= dataServiceFactory
            .CreateServiceWithOptions<InvolvePartyModel>('InvolvedParties', option);
    }

    GetAll(): Observable<ResponseModel<IncidentModel>> {
        return this._dataService.Query()
            .Expand('ParentCheckList($select=CheckListId,CheckListCode)',
            'TargetDepartment($select=DepartmentId,DepartmentName)',
            'EmergencyType($select=EmergencyTypeId,EmergencyTypeName)')
            .OrderBy('CreatedOn desc')
            .Execute();
    }
    GetAllActiveIncidents(): Observable<ResponseModel<IncidentModel>> {
        return this._dataService.Query()
            .Filter("ActiveFlag eq 'Active'")
            .OrderBy('CreatedOn desc')
            .Execute();
    }

    Get(id: string | number): Observable<IncidentModel> {
        return this._dataService.Get(id.toString()).Execute();
    }

    CreateIncident(incidentModel: IncidentModel, isFlightRelated: boolean, involvedParty?: InvolvePartyModel,
        flight?: FlightModel): Observable<IncidentModel> {
        let incident: IncidentModel;
        if (isFlightRelated) {
            return this._dataService.Post(incidentModel)
                .Execute()
                .map((data: IncidentModel) => {
                    incident = data;
                    involvedParty.IncidentId = incident.IncidentId;
                    return data;
                })
                .flatMap((data: IncidentModel) => this.CreateInvolveParty(involvedParty))
                .map((data: InvolvePartyModel) => {
                    flight.InvolvedPartyId = data.InvolvedPartyId;
                    return incident;
                })
                .flatMap((data: IncidentModel) => this.flightService.CreateFlight(flight))
                .map((data: FlightModel) => {
                    return incident;
                });
        }
        else {
            return this._dataService.Post(incidentModel)
                .Execute();
        }
    }

    GetIncidentById(id: number): Observable<IncidentModel> {
        return this._dataService.Get(id.toString())
            .Execute();
    }

    CreateInvolveParty(entity: InvolvePartyModel): Observable<InvolvePartyModel> {
        let involvedParty: InvolvePartyModel;
        return this._involvePartyDataService.Post(entity)
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
}