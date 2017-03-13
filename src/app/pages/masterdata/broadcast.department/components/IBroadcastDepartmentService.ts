import { Observable } from 'rxjs/Rx';
import { BroadCastDepartmentModel } from './broadcast.department.model';
import { IServiceInretface, ResponseModel } from '../../../../shared';

export interface IBroadCastDepartmentService extends IServiceInretface<BroadCastDepartmentModel> {
    Query(departmentId: number): Observable<ResponseModel<BroadCastDepartmentModel>>
}