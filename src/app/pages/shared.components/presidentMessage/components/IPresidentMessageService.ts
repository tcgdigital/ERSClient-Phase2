import { Observable } from 'rxjs/Rx';
import { PresidentMessageModel } from './presidentMessage.model';
import { IServiceInretface, ResponseModel } from '../../../../shared';

export interface IPresidentMessageService extends IServiceInretface<PresidentMessageModel> {
    Query(departmentId: number, incidentId: number): Observable<ResponseModel<PresidentMessageModel>>;

    GetLatest(incidentId: number): Observable<ResponseModel<PresidentMessageModel>>;

    GetPublished(incidentId: number): Observable<ResponseModel<PresidentMessageModel>>;
}