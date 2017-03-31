
import { Observable } from 'rxjs/Rx';
import { EmergencyDepartmentModel } from './emergency.department.model';
import { IServiceInretface, ResponseModel } from '../../../../shared';

export interface IEmergencyTypeDepartmentService extends IServiceInretface<EmergencyDepartmentModel> {
    GetFilterByEmergencyType(emergencyTypeId: number): Observable<ResponseModel<EmergencyDepartmentModel>>
}