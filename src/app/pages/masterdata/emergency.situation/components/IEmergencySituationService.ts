import { Observable } from 'rxjs/Rx';
import { EmergencySituationModel } from './emergencysituation.model';
import { ResponseModel, IServiceInretface } from '../../../../shared';

export interface IEmergencySituationService extends IServiceInretface<EmergencySituationModel> {
    GetAllActiveEmergencySituations(): Observable<ResponseModel<EmergencySituationModel>>;
}