import { Observable } from 'rxjs/Rx';
import { DemandTypeModel } from './demandtype.model';
import { IServiceInretface, ResponseModel, BaseModel, NameValue } from '../../../../shared';

export interface IDemandTypeService extends IServiceInretface<DemandTypeModel> {
  GetAllApproverDepartment(): Observable<Array<NameValue<number>>>;

  GetQuery(query: string): Observable<ResponseModel<DemandTypeModel>>;

  GetAllApproverDepartmentAlternet(): Observable<Array<NameValue<number>>>;
}