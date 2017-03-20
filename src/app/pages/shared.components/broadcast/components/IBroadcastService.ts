import { Observable } from 'rxjs/Rx';
import { BroadCastModel } from './broadcast.model';
import { IServiceInretface, ResponseModel } from '../../../../shared';

export interface IBroadcastService extends IServiceInretface<BroadCastModel> {
    Query(departmentId: number, incidentId: number): Observable<ResponseModel<BroadCastModel>>

    GetLatest(departmentId: number, incidentId: number): Observable<ResponseModel<BroadCastModel>>;

    GetPublished(incidentId: number): Observable<ResponseModel<BroadCastModel>>;
}