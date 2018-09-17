import { Observable } from 'rxjs/Rx';
import { ExternalInputModel, PDAEnquiryModel } from './callcenteronlypage.model';
import { IServiceInretface, ResponseModel } from '../../../shared';

export interface ICallCenterService extends IServiceInretface<ExternalInputModel> {
    GetPassengerAndCrewQueryByIncident(incidentId: number, callId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetCargoQueryByIncident(incidentId: number, callId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetGroundVictimQueryByIncident(incidentId: number, callId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetMediaAndOtherQueryByIncident(IncidentId: number, CallId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetPassengerQueryCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetPassengerQueryCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetCrewQueryCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetCrewQueryCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetCargoQueryCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetCargoQueryCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetOtherQueryCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetOtherQueryCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;

    updatepdaenquiry(entity: PDAEnquiryModel, key?: number): Observable<PDAEnquiryModel>;

    GetMediaQueryCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetMediaQueryCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetFutureTravelCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetFutureTravelCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetGeneralUpdateCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetGeneralUpdateCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetSituationalUpdatesCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetSituationalUpdatesCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetCustomerDissatisfactionCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetCustomerDissatisfactionCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetGroundVictimCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;

    GetGroundVictimCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;
}