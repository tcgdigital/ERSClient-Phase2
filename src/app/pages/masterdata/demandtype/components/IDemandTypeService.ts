import { Observable } from 'rxjs/Rx';
import { DemandTypeModel } from './demandtype.model';
import { IServiceInretface, ResponseModel, BaseModel, NameValue } from '../../../../shared';

export interface IDemandTypeService extends IServiceInretface<DemandTypeModel> {
  // GetAllActiveCheckLists(): Observable<ResponseModel<ChecklistModel>>;
   
   //GetAllByDepartment(departmentId): Observable<ResponseModel<ChecklistModel>>;
    GetAllApproverDepartment() : Observable<NameValue<number>[]>;

    GetQuery(query: string): Observable<ResponseModel<DemandTypeModel>>;

}