import { Observable } from 'rxjs/Rx';
import { IncidentModel } from './incident.model';
import { InvolvePartyModel, FlightModel } from '../../shared.components';
import { IServiceInretface, ResponseModel } from '../../../shared';


export interface IIncidentService extends IServiceInretface<IncidentModel> {
    CreateInvolveParty(entity: InvolvePartyModel): Observable<InvolvePartyModel>;

    GetOpenIncidents(): Observable<ResponseModel<IncidentModel>>;

    GetAllActiveIncidents(): Observable<ResponseModel<IncidentModel>>;

    CreateIncident(incidentModel: IncidentModel, isFlightRelated: boolean, involvedParty?: InvolvePartyModel,
        flight?: FlightModel): Observable<IncidentModel>;

    GetIncidentById(id: number): Observable<IncidentModel>;

    CreateInvolveParty(entity: InvolvePartyModel): Observable<InvolvePartyModel>;

    GetLastConfiguredCountIncidents(count:string): Observable<ResponseModel<IncidentModel>>;

    GetFlightInfoFromIncident(incidentId: number): Observable<FlightModel>;

    IsAnyOpenIncidents(): Observable<boolean>;
}