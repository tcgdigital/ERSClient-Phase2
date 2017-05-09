import { Observable } from 'rxjs/Rx';
import { ChecklistModel } from './checklist.model';
import { IServiceInretface, ResponseModel, BaseModel } from '../../../../shared';

export interface IChecklistService extends IServiceInretface<ChecklistModel> {
   GetAllActiveCheckLists(): Observable<ResponseModel<ChecklistModel>>;
   
   GetAllByDepartment(departmentId): Observable<ResponseModel<ChecklistModel>>;

    GetQuery(query: string): Observable<ResponseModel<ChecklistModel>>;

     GetParentChecklistCode(parentchecklistId) : Observable<ResponseModel<ChecklistModel>>;
}