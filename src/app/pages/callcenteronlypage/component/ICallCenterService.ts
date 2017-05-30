import { Observable } from 'rxjs/Rx';
import { ExternalInputModel } from './callcenteronlypage.model';
import { IServiceInretface, ResponseModel } from '../../../shared';

export interface ICallCenterService extends IServiceInretface<ExternalInputModel> {
   
   GetPassengerQueryCallsByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;

   GetPassengerQueryCallsRecievedByIncident(IncidentId: number): Observable<ResponseModel<ExternalInputModel>>;
}