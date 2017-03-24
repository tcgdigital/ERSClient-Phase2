import { Injectable, Output, EventEmitter } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { DemandModel, DemandModelToView } from './demand.model';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService,
    IServiceInretface, BaseModel, RequestModel, GlobalConstants, WEB_METHOD
} from '../../../../shared';

@Injectable()
export class DemandService implements IServiceInretface<DemandModel> {
    private _dataService: DataService<DemandModel>;
    private _bulkDataService: DataService<DemandModel>;
    private _bulkDataServiceForCompletion: DataService<DemandModel>;
    private _bulkDataServiceForApproval: DataService<DemandModel>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<DemandModel>('Demands', option);
        this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<DemandModel>
            ('DemandBatch', 'BatchPostAsync', option);
        this._bulkDataServiceForCompletion = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<DemandModel>
            ('DemandCompletionBatch', '', option);
        this._bulkDataServiceForApproval = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<DemandModel>
            ('DemandApproveBatch', '', option);
        this._bulkDataServiceForCompletion = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<DemandModel>
            ('DemandClosureBatch', '', option);

    }

    GetAll(): Observable<ResponseModel<DemandModel>> {
        return this._dataService.Query()
            .Expand('ApproverDepartment($select=DepartmentName)')
            .Execute();
    };

    Get(id: any): Observable<DemandModel> {
        return this._dataService.Get(id.toString()).Execute();
    };

    GetForAssignedDept(targetDeptId: number, incidentId: number): Observable<ResponseModel<DemandModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${incidentId} and TargetDepartmentId eq ${targetDeptId}  and IsClosed eq false and IsApproved eq true and IsCompleted eq false`)
            .Expand('RequesterDepartment($select=DepartmentName) , DemandType($select=DemandTypeName)')
            .Execute();
    };

    GetByRequesterDepartment(requesterDeptId: number, incidentId: number): Observable<ResponseModel<DemandModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${incidentId} and RequesterDepartmentId eq ${requesterDeptId}`)
            .Expand('TargetDepartment($select=DepartmentName) , DemandType($select=DemandTypeName)')
            .Execute();
    };

    GetByApproverDepartment(approverDeptId: number, incidentId: number): Observable<ResponseModel<DemandModel>> {
        return this._dataService.Query()
            .Filter(`ApproverDepartmentId eq ${approverDeptId} and IncidentId eq ${incidentId} and
             IsClosed eq false and IsApproved eq false and IsRejected eq false and IsCompleted eq false`)
            .Expand('TargetDepartment($select=DepartmentName), RequesterDepartment($select=DepartmentName) , DemandType($select=DemandTypeName)')
            .Execute();
    };

    GetCompletedDemands(deptId: number, incidentId: number): Observable<ResponseModel<DemandModel>> {
        return this._dataService.Query()
            .Filter(`RequesterDepartmentId eq ${deptId} and IncidentId eq ${incidentId} and IsClosed eq false and IsCompleted eq true and IsApproved eq true`)
            .Expand('TargetDepartment($select=DepartmentName), RequesterDepartment($select=DepartmentName) , DemandType($select=DemandTypeName)')
            .Execute();
    };

    Create(entity: DemandModel): Observable<DemandModel> {
        return this._dataService.Post(entity).Execute();
    };

    CreateBulk(entities: DemandModel[]): Observable<DemandModel[]> {
        return this._bulkDataService.BulkPost(entities).Execute();
    };

    DemandMapper(entities: DemandModel[]): DemandModelToView[] {
        let demandModelToView: DemandModelToView[];
        demandModelToView = entities.map(function (demand) {
            let item = new DemandModelToView;

            item.DemandId = demand.DemandId;
            item.DemandTypeName = demand.DemandType.DemandTypeName;
            item.DemandDesc = demand.DemandDesc;
            item.RequesterDepartmentName = (!demand.RequesterDepartment) ? "" : demand.RequesterDepartment.DepartmentName;
            item.Priority = demand.Priority;
            item.RequiredLocation = demand.RequiredLocation;
            item.ScheduleTime = demand.ScheduleTime;
            item.EndTime = new Date(new Date(demand.CreatedOn).getTime() + parseInt(demand.ScheduleTime) * 60000);
            item.ElapseTime = new Date().getTime() - new Date(demand.CreatedOn).getTime();
            item.RagStatus = 'statusGreen';
            item.IsRejected = demand.IsRejected;
            item.Remarks = demand.Remarks;
            item.RequesterDepartmentId = demand.RequesterDepartmentId;
            item.IsCompleted = demand.IsCompleted;
            item.CreatedOn = demand.CreatedOn;
            item.ContactNumber = demand.ContactNumber;
            item.DemandStatusDescription = demand.DemandStatusDescription;
            item.TargetDepartmentName = (!demand.TargetDepartment) ? "" : demand.TargetDepartment.DepartmentName;
            item.RequestedBy = demand.RequestedBy;
            item.ClosedOn = demand.ClosedOn;
            item.AffectedObjectId = demand.AffectedObjectId;
            item.AffectedPersonId = demand.AffectedPersonId;
            item.IsClosed = demand.IsClosed;
            return item;

        });
        return demandModelToView;
    };

    Update(entity: DemandModel): Observable<DemandModel> {
        let key: string = entity.DemandId.toString()
        return this._dataService.Patch(entity, key)
            .Execute();
    };

    Delete(entity: DemandModel): void {
    };
   
    UpdateBulkForCompletion(entities: DemandModel[]): Observable<DemandModel[]> {
        return this._bulkDataServiceForCompletion.BulkPost(entities).Execute();
    };

    UpdateBulkForApproval(entities: DemandModel[]): Observable<DemandModel[]> {
        return this._bulkDataServiceForApproval.BulkPost(entities).Execute();
    };

    UpdateBulkForClosure(entities: DemandModel[]): Observable<DemandModel[]> {
        return this._bulkDataServiceForCompletion.BulkPost(entities).Execute();
    };

}