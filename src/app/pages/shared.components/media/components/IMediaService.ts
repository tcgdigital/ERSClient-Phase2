import { Observable } from 'rxjs/Rx';
import { MediaModel } from './media.model';
import { IServiceInretface, ResponseModel } from '../../../../shared';

export interface IMediaService extends IServiceInretface<MediaModel> {
    Query(departmentId: number, incidentId: number): Observable<ResponseModel<MediaModel>>

    GetLatest(incidentId: number): Observable<ResponseModel<MediaModel>>;

    GetPublished(incidentId: number): Observable<ResponseModel<MediaModel>>;
}