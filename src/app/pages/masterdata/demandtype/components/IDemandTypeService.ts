import { Observable } from 'rxjs/Rx';
import { DemandTypeModel } from './demandtype.model';
import { IServiceInretface, ResponseModel, BaseModel } from '../../../../shared';

export interface IDemandTypeService extends IServiceInretface<DemandTypeModel> {
  // GetAllActiveCheckLists(): Observable<ResponseModel<ChecklistModel>>;
   
   //GetAllByDepartment(departmentId): Observable<ResponseModel<ChecklistModel>>;
}