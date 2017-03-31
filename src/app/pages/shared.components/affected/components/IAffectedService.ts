import { Observable } from 'rxjs/Rx';
import { AffectedModel } from './affected.model';
import { IServiceInretface, ResponseModel, } from '../../../../shared';

export interface IAffectedService extends IServiceInretface<AffectedModel> {
    GetAllActiveAffecteds(): Observable<ResponseModel<AffectedModel>>
}