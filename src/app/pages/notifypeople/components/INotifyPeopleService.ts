import { Observable } from 'rxjs/Rx';
import { IServiceInretface ,ResponseModel} from '../../../shared';
import { NotifyPeopleModel ,UserDepartmentNotificationMapper} from './notifypeople.model';

export interface INotifyPeopleService extends IServiceInretface<UserDepartmentNotificationMapper> {

    GetAllByIncident(incidentId: number): Observable<ResponseModel<UserDepartmentNotificationMapper>>;

}