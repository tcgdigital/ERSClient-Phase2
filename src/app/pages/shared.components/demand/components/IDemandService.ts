<<<<<<< HEAD
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { DemandModel, DemandModelToView } from './demand.model';
import {
   ServiceBase,ResponseModel
} from '../../../../shared';

export interface IDemandService extends ServiceBase<DemandModel> {

GetForAssignedDept(targetDeptId: number, incidentId: number): Observable<ResponseModel<DemandModel>>;

GetByRequesterDepartment(requesterDeptId: number, incidentId: number): Observable<ResponseModel<DemandModel>>;

GetByApproverDepartment(approverDeptId: number, incidentId: number): Observable<ResponseModel<DemandModel>>;

GetCompletedDemands(deptId: number, incidentId: number): Observable<ResponseModel<DemandModel>>;

DemandMapper(entities: DemandModel[]): DemandModelToView[] ;

UpdateBulkForCompletion(entities: DemandModel[]): Observable<DemandModel[]>;

UpdateBulkForApproval(entities: DemandModel[]): Observable<DemandModel[]>;

UpdateBulkForClosure(entities: DemandModel[]): Observable<DemandModel[]>;

=======
import { Observable } from 'rxjs/Rx';
import { DemandModel, DemandModelToView } from './demand.model';
import { ResponseModel, IServiceInretface } from '../../../../shared';

export interface IDemandService extends IServiceInretface<DemandModel> {
    GetForAssignedDept(targetDeptId: number, incidentId: number): Observable<ResponseModel<DemandModel>>;

    GetByRequesterDepartment(requesterDeptId: number, incidentId: number): Observable<ResponseModel<DemandModel>>;
    
    GetByApproverDepartment(approverDeptId: number, incidentId: number): Observable<ResponseModel<DemandModel>>;

    GetCompletedDemands(deptId: number, incidentId: number): Observable<ResponseModel<DemandModel>>;

    DemandMapper(entities: DemandModel[]): DemandModelToView[];

    UpdateBulkForCompletion(entities: DemandModel[]): Observable<DemandModel[]>;

    UpdateBulkForApproval(entities: DemandModel[]): Observable<DemandModel[]>;

    UpdateBulkForClosure(entities: DemandModel[]): Observable<DemandModel[]>;
>>>>>>> ec0391781432d11b378fc3419888d710fd2349e2
}