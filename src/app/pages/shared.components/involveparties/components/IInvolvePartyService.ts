
import { Observable } from 'rxjs/Rx';
import { InvolvePartyModel } from './involveparty.model';
import { IServiceInretface, ResponseModel } from '../../../../shared';
import { IncidentModel } from '../../../incident';

export interface IInvolvePartyService extends IServiceInretface<InvolvePartyModel> {

    GetAllActiveInvolvedParties(): Observable<ResponseModel<InvolvePartyModel>>;

    GetIncidentById(id: string | number): Observable<IncidentModel>;
}