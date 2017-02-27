import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { IncidentModel } from './incident.model';
import { ResponseModel,DataService,DataServiceFactory,DataProcessingService } from '../../../../shared';
import { DepartmentService } from '../../department/components/department.service';
import { EmergencyTypeService } from '../../emergencyType/components/emergencyType.service';
import { DepartmentModel } from '../../department/components/department.model';
import { EmergencyTypeModel } from '../../emergencyType/components/emergencyType.Model';
import { InvolvedPartyModel } from '../../involvedParty/components/involvedParty.model';
import { InvolvedPartyService } from '../../involvedParty/components/involvedParty.service';
import { FlightModel } from '../../flight/components/flight.model';
import { FlightService } from '../../flight/components/flight.service';

@Injectable()
export class IncidentService {
    private _dataService: DataService<IncidentModel>;

    constructor(private dataServiceFactory: DataServiceFactory,
        private departmentService: DepartmentService,
        private involvedPartyService:InvolvedPartyService,
        private flightService:FlightService,
        private emergencyTypeService: EmergencyTypeService
    ) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<IncidentModel>('Incidents', option);
    }

    GetAllIncidents(): Observable<ResponseModel<IncidentModel>> {
        debugger;
        return this._dataService.Query()
            .Expand('ParentCheckList($select=CheckListId,CheckListCode)',
                'TargetDepartment($select=DepartmentId,DepartmentName)',
                'EmergencyType($select=EmergencyTypeId,EmergencyTypeName)')
            .OrderBy("CreatedOn desc")
            .Execute();
    }
    GetAllActiveIncidents(): Observable<ResponseModel<IncidentModel>> {
        debugger;
        return this._dataService.Query()
            .Filter("ActiveFlag eq 'Active'")
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    CreateIncident(incidentModel: IncidentModel,isFlightRelated:boolean, involvedParty?: InvolvedPartyModel,
     flight?: FlightModel): Observable<IncidentModel> {
        let incident: IncidentModel;
        if (isFlightRelated) {
            return this._dataService.Post(incidentModel)
                .Execute()
                .map((data: IncidentModel) => {
                    incident = data;
                    if (incident.ActiveFlag == 'Active') {
                        incident.Active = true;
                    }
                    else {
                        incident.Active = false;
                    }
                    console.log('Insert Successful');
                    involvedParty.IncidentId = incident.IncidentId;
                    return data;
                })
                .flatMap((data: IncidentModel) => this.involvedPartyService.CreateInvolvedParty(involvedParty))
                .map((data: InvolvedPartyModel) => {
                    flight.InvolvedPartyId = data.InvolvedPartyId;
                    return incident;
                })
                .flatMap((data: IncidentModel) => this.flightService.CreateFlight(flight))
                .map((data: FlightModel) => {
                    
                    return incident;
                });
        }
        else{
            console.log('else part in incident insert');
             return this._dataService.Post(incidentModel)
            .Execute();
        }

    }



    GetIncidentById(id: number): Observable<IncidentModel> {
        return this._dataService.Get(id.toString())
            .Execute();
    }
}