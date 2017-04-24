import { Observable } from 'rxjs/Rx';
import { EmergencyLocationModel } from './emergencylocation.model';
import { ResponseModel, IServiceInretface } from '../../../../shared';

export interface IEmergencyLocationService extends IServiceInretface<EmergencyLocationModel> {
    GetAllActiveEmergencyLocations(): Observable<ResponseModel<EmergencyLocationModel>>;
}