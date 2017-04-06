import { Observable } from 'rxjs/Rx';
import { DepartmentAccessOwnerModel } from './departmentaccessowner.model';
import { IServiceInretface, ResponseModel, BaseModel } from '../../../../shared';

export interface IDepartmentAccessOwnerService extends IServiceInretface<DepartmentAccessOwnerModel> {

    GetDependentDepartmentAccessOwners(departmentId: number): Observable<ResponseModel<DepartmentAccessOwnerModel>>;
}