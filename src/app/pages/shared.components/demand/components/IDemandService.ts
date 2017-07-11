import { Observable } from 'rxjs/Rx';
import { DemandModel, DemandModelToView } from './demand.model';
import {
    ServiceBase, ResponseModel
} from '../../../../shared';
import { DepartmentAccessOwnerModel } from '../../../shared.components/departmentaccessowner';

export interface IDemandService extends ServiceBase<DemandModel> {

    GetForAssignedDept(targetDeptId: number, incidentId: number): Observable<ResponseModel<DemandModel>>;

    GetByRequesterDepartment(requesterDeptId: number, incidentId: number): Observable<ResponseModel<DemandModel>>;

    GetByApproverDepartment(approverDeptId: number, incidentId: number): Observable<ResponseModel<DemandModel>>;

    GetCompletedDemands(deptId: number, incidentId: number): Observable<ResponseModel<DemandModel>>;

    DemandMapper(entities: DemandModel[]): DemandModelToView[];

    UpdateBulkForCompletion(entities: DemandModel[]): Observable<DemandModel[]>;

    UpdateBulkForApproval(entities: DemandModel[]): Observable<DemandModel[]>;

    UpdateBulkForClosure(entities: DemandModel[]): Observable<DemandModel[]>;

    GetDepartmentIdProjection(departmentId: number): Observable<ResponseModel<DepartmentAccessOwnerModel>>;

    GetDemandByTargetDepartments(incidentId: number, departmentIdProjection: string): Observable<ResponseModel<DemandModel>>;

    GetDemandByRequesterDepartments(incidentId: number, departmentIdProjection: string): Observable<ResponseModel<DemandModel>>;

    GetDemandByRequesterDepartment(incidentId: number, departmentId: number): Observable<ResponseModel<DemandModel>>;

    BatchGet(incidentId: number, departmentIds: number[]): Observable<ResponseModel<DemandModel>>;
}