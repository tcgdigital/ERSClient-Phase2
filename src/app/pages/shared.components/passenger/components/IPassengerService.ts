import { Observable } from 'rxjs/Rx';

import { PassengerModel, CoPassengerMappingModel } from './passenger.model';
import { IServiceInretface, ResponseModel } from '../../../../shared';

export interface IPassengerService extends IServiceInretface<CoPassengerMappingModel> {

    getGroupId(PassengerId: number):Observable<ResponseModel<CoPassengerMappingModel>>;
    getCoPassengers(GroupId: number):Observable<ResponseModel<CoPassengerMappingModel>>;

}