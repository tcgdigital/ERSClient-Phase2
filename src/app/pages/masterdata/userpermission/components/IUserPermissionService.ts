import { Observable } from 'rxjs/Rx';
import { DepartmentModel } from '../../department';
import { UserPermissionModel, DepartmentsToView } from './userpermission.model';
import { ResponseModel, IServiceInretface } from '../../../../shared';

export interface IUserPermissionService extends IServiceInretface<UserPermissionModel> {
    GetFilterByUsers(userId: number): Observable<ResponseModel<UserPermissionModel>>;

    CreateDefaultDepartmentList(departments: DepartmentModel[]): DepartmentsToView[]
}