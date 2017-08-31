import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {
    ResponseModel, DataService, DataServiceFactory,
    DataProcessingService
} from '../../../shared';

import { IncidentModel } from '../../incident'

import { InvolvePartyModel, AffectedPeopleModel, CargoModel, GroundVictimModel } from '../../shared.components';



/**
 * Service for fetching valid uploaded records
 * 
 * @export
 * @class MasterDataUploadForValidService
 */
@Injectable()
export class MasterDataUploadForValidService {
   
    private _dataServiceAffectedPeople: DataService<InvolvePartyModel>;
    private _dataServiceAffectedObject: DataService<InvolvePartyModel>;
    private _dataServiceGroundVictims: DataService<InvolvePartyModel>;
    private _dataServiceIncident: DataService<IncidentModel>;
    private _validPassengers: AffectedPeopleModel[] = [];
    
    /**
     * Creates an instance of MasterDataUploadForValidService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf AffectedPeopleService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();   

        this._dataServiceAffectedPeople = this.dataServiceFactory
            .CreateServiceWithOptions<InvolvePartyModel>('InvolvedParties', option);

        this._dataServiceAffectedObject = this.dataServiceFactory
            .CreateServiceWithOptions<InvolvePartyModel>('InvolvedParties', option);

        this._dataServiceGroundVictims = this.dataServiceFactory
            .CreateServiceWithOptions<InvolvePartyModel>('InvolvedParties', option);
        
        this._dataServiceIncident = this.dataServiceFactory
            .CreateServiceWithOptions<IncidentModel>('Incidents', option);
    }

    /**
     * Get All Passenger By IncidentId
     * 
     * @param {number} incidentId 
     * @returns {Observable<ResponseModel<InvolvePartyModel>>} 
     *  @returns Observable<AffectedPeopleModel[]>
     * @memberOf MasterDataUploadForValidService
     */
    GetAllPassengerByIncidentId(incidentId: number): Observable<AffectedPeopleModel[]>{
        let involvePartyProjection = 'InvolvedPartyType,InvolvedPartyDesc';
        let affectedProjection = 'Severity';
        let affectedPeopleProjection = 'AffectedPersonId,TicketNumber,IsStaff,IsCrew,IsVerified,Identification';
        let passengerPrjection = 
        'PassengerId,FlightNumber,PassengerName,PassengerGender,PassengerNationality,BaggageCount,Pnr,PassengerType,ContactNumber,Seatno,IdentificationDocType,IdentificationDocNumber,PassengerType,IsVip,Origin,Destination,InboundFlightNumber,OutBoundFlightNumber,EmployeeId';

        return this._dataServiceAffectedPeople.Query()
            .Expand(`Affecteds($select=${affectedProjection};$expand=AffectedPeople($filter=PassengerId ne null;$select=${affectedPeopleProjection};$expand=Passenger;$orderby=Passenger/PassengerName))`)
            .Filter(`IncidentId eq ${incidentId}`)
            .Select(involvePartyProjection)
            .Execute()
            .map(x=>x.Records.map(y=>y.Affecteds).reduce((a,b)=>a.concat(b)))
            .map(x=>x.map(y=>y.AffectedPeople).reduce((a,b)=>a.concat(b)));                       
    }

    /**
     * Get All Crew By IncidentId
     * 
     * @param {number} incidentId 
     * @returns {Observable<AffectedPeopleModel[]>} 
     * 
     * @memberOf MasterDataUploadForValidService
     */
    GetAllCrewByIncidentId(incidentId: number): Observable<AffectedPeopleModel[]>{
        let involvePartyProjection = 'InvolvedPartyType,InvolvedPartyDesc';
        let affectedProjection = 'Severity';
        let affectedPeopleProjection = 'AffectedPersonId,TicketNumber,IsStaff,IsCrew,IsVerified,Identification';
        let crewPrjection = 'CrewId,EmployeeNumber,CrewName,CrewDob,AsgCat,DeadheadCrew,BaseLocation,Email,DepartureStationCode,ArrivalStationCode,FlightNo,WorkPosition,ContactNumber';

        return this._dataServiceAffectedPeople.Query()
        .Expand(`Affecteds($select=${affectedProjection};$expand=AffectedPeople($filter=CrewId ne null;$select=${affectedPeopleProjection};$expand=Crew;$orderby=Crew/CrewName))`)
        .Filter(`IncidentId eq ${incidentId}`)
        .Select(`${involvePartyProjection}`)
        .Execute()
        .map(x=>x.Records.map(y=>y.Affecteds).reduce((a,b)=>a.concat(b)))
        .map(x=>x.map(y=>y.AffectedPeople).reduce((a,b)=>a.concat(b)));
    }

    /**
     * Get All Cargo By IncidentId
     * 
     * @param {number} incidentId 
     * @returns {Observable<ResponseModel<AffectedObjectModel>>} 
     * 
     * @memberOf MasterDataUploadForValidService
     */
    GetAllCargoByIncidentId(incidentId: number): Observable<CargoModel[]>{
        return this._dataServiceAffectedObject.Query()
        .Expand(`Flights($expand=Cargoes)`)
        .Filter(`IncidentId eq ${incidentId}`)
        .Execute()
        .map(a=>a.Records.map(b=>b.Flights).reduce((a,b)=>a.concat(b)))
        .map(a=>a.map(b=>b.Cargoes).reduce((a,b)=>a.concat(b)));
    }


    /**
     * Get All Ground Victims
     * 
     * @param {number} incidentId 
     * @returns {Observable<GroundVictimModel[]>} 
     * 
     * @memberOf MasterDataUploadForValidService
     */
    GetAllGroundVictimsByIncidentId(incidentId: number): Observable<GroundVictimModel[]>{
        return this._dataServiceGroundVictims.Query()
        .Expand(`GroundVictims`)
        .Filter(`IncidentId eq ${incidentId}`)
        .Execute()
        .map(a=>a.Records.map(b=>b.GroundVictims).reduce((a,b)=>a.concat(b)));
    }

    GetCurrentIncidentWithLoadSheet(incidentId: number): Observable<ResponseModel<IncidentModel>>{
        return this._dataServiceIncident.Query()
        .Filter(`IncidentId eq ${incidentId}`)
        .Expand(`FileStores`)
        .Execute();        
    }
}
