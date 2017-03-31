import { Observable } from 'rxjs/Rx';
import { ActionableModel } from './actionable.model';
import { IServiceInretface, ResponseModel, BaseModel } from '../../../../shared';

export interface IActionableService extends IServiceInretface<ActionableModel> {

    GetAllOpenByIncidentIdandDepartmentId(incidentId: number, departmentId: number): Observable<ResponseModel<ActionableModel>>;
    
    GetAllCloseByIncidentIdandDepartmentId(incidentId: number, departmentId: number): Observable<ResponseModel<ActionableModel>>;
    
    setRagColor(businessTimeStart?: Date, businessTimeEnd?: Date): string;
    
    BatchOperation(data: any[]): Observable<ResponseModel<BaseModel>>;

    GetOpenActionableCount(incidentId: string | number, departmentId: string | number): Observable<number>;

    GetCloseActionableCount(incidentId: string | number, departmentId: string | number): Observable<number>;
}