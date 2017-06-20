import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { InvolvePartyModel } from './involveparty.model';
import { IInvolvePartyService } from './IInvolvePartyService';
import { AffectedPeopleModel } from '../../affected.people/components/affected.people.model';
import {
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService,
    ServiceBase, UtilityService
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
    public affectedPeoples: ResponseModel<AffectedPeopleModel>;
    /**
     * Creates an instance of InvolvePartyService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf InvolvePartyService
     */
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

    GetByIncidentId(id: string | number): Observable<ResponseModel<InvolvePartyModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq ${id}`)
            .Execute();
    }

    GetAllPassengers(): Observable<ResponseModel<InvolvePartyModel>> {
        return this._dataService.Query()
            .Expand('Affecteds($expand=AffectedPeople($expand=Passenger))')
            .Execute();
    }

    GetFilterByIncidentId(IncidentId): Observable<ResponseModel<InvolvePartyModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId}`)
            .Expand('Affecteds($expand=AffectedPeople($expand=Passenger($expand=CoPassengerMappings),Crew($expand=FileStores)))')
            .Execute();
    }

    GetQuery(query: string, incidentId: number): Observable<ResponseModel<InvolvePartyModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${incidentId}`)
            .Expand(`Affecteds($expand=AffectedPeople($expand=Passenger,Crew;$filter=${query}))`)
            //.Filter(query)
            .Execute();
    }

    public GetAllPassengersByIncident(incidentId: number): Observable<ResponseModel<InvolvePartyModel>> {
        let involvePartyProjection: string = 'InvolvedPartyType,InvolvedPartyDesc';
        let affectedProjection: string = 'Severity';
        let affectedPeopleProjection: string = 'AffectedPersonId,TicketNumber,IsStaff,IsCrew,IsVerified,Identification';
        let passengerPrjection: string = 'PassengerId,FlightNumber,PassengerName,PassengerGender,BaggageCount,Destination,PassengerDob,Pnr,PassengerType,PassengerNationality,DepartureDateTime,ArrivalDateTime,ContactNumber,Seatno';
        return this._dataService.Query()
            .Expand(`Affecteds($select=${affectedProjection};$expand=AffectedPeople($filter=PassengerId ne null;$select=${affectedPeopleProjection};$expand=Passenger($select=${passengerPrjection}),NextOfKins))`)
            .Filter(`IncidentId eq ${incidentId}`)
            .Select(`${involvePartyProjection}`)
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    public GetAllCrewsByIncident(incidentId: number): Observable<ResponseModel<InvolvePartyModel>> {
        let involvePartyProjection: string = 'InvolvedPartyType,InvolvedPartyDesc';
        let affectedProjection: string = 'Severity';
        let affectedCrewProjection: string = 'AffectedPersonId,TicketNumber,IsStaff,IsCrew,IsVerified,Identification';
        let crewPrjection: string = 'CrewId,EmployeeNumber,CrewName,AsgCat,DeadheadCrew,BaseLocation,Email,DepartureStationCode,ArrivalStationCode,FlightNo,WorkPosition,ContactNumber';
        return this._dataService.Query()
            .Expand(`Affecteds($select=${affectedProjection};$expand=AffectedPeople($filter=CrewId ne null;$select=${affectedCrewProjection};$expand=Crew($select=${crewPrjection}),NextOfKins))`)
            .Filter(`IncidentId eq ${incidentId}`)
            .Select(`${involvePartyProjection}`)
            .OrderBy("CreatedOn desc")
            .Execute();
    }

    public GetQueryForPassenger(query: string, incidentId: number): Observable<ResponseModel<InvolvePartyModel>> {
        let involvePartyProjection: string = 'InvolvedPartyType,InvolvedPartyDesc';
        let affectedProjection: string = 'Severity';
        let affectedPeopleProjection: string = 'AffectedPersonId,TicketNumber,IsStaff,IsCrew,IsVerified,Identification';
        let passengerPrjection: string = 'PassengerId,FlightNumber,PassengerName,PassengerGender,BaggageCount,Destination,PassengerDob,Pnr,PassengerType,PassengerNationality,DepartureDateTime,ArrivalDateTime,ContactNumber,Seatno';
        return this._dataService.Query()
            .Expand(`Affecteds($select=${affectedProjection};$expand=AffectedPeople($filter=PassengerId ne null and ${query};$select=${affectedPeopleProjection};$expand=Passenger($select=${passengerPrjection}),NextOfKins))`)
            .Filter(`IncidentId eq ${incidentId}`)
            .Select(`${involvePartyProjection}`)
            .Execute();
    }

    public GetAllCargosByIncident(incidentId: number): Observable<ResponseModel<InvolvePartyModel>> {
        return this._dataService.Query()
            .Expand(`Flights($expand=Cargoes)`)
            .Filter(`IncidentId eq ${incidentId}`)
            .Execute();
    }

    public GetQueryCargosByIncident(query: string, incidentId: number): Observable<ResponseModel<InvolvePartyModel>> {
        return this._dataService.Query()
            .Expand(`Flights($expand=Cargoes($filter=${query}))`)
            .Filter(`IncidentId eq ${incidentId}`)
            .Execute();
    }

}