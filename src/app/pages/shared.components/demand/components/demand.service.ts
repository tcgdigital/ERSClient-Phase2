import { Injectable, Output, EventEmitter } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { DemandModel, DemandModelToView } from './demand.model';
import { IDemandService } from './IDemandService';
import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService, ServiceBase,
    IServiceInretface, BaseModel, RequestModel, GlobalConstants, WEB_METHOD

} from '../../../../shared';

@Injectable()
export class DemandService extends ServiceBase<DemandModel> implements IDemandService {
    private _bulkDataService: DataService<DemandModel>;
    private _bulkDataServiceForCompletion: DataService<DemandModel>;
    private _bulkDataServiceForApproval: DataService<DemandModel>;

    /**
     * Creates an instance of DemandService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf DemandService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'Demands');
        let option: DataProcessingService = new DataProcessingService();
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

    public GetAll(): Observable<ResponseModel<DemandModel>> {
        return this._dataService.Query()
            .Expand('ApproverDepartment($select=DepartmentName)').Execute();
    };

    public GetForAssignedDept(targetDeptId: number, incidentId: number): Observable<ResponseModel<DemandModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq ${incidentId} and TargetDepartmentId eq ${targetDeptId}  and IsClosed eq false and IsApproved eq true and IsCompleted eq false`)
            .Expand('RequesterDepartment($select=DepartmentName) , DemandType($select=DemandTypeName)')
            .Execute();
    };

    public GetByRequesterDepartment(requesterDeptId: number, incidentId: number): Observable<ResponseModel<DemandModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${incidentId} and RequesterDepartmentId eq ${requesterDeptId}`)
            .Expand('TargetDepartment($select=DepartmentName) , DemandType($select=DemandTypeName)')
            .Execute();
    };

    public GetByApproverDepartment(approverDeptId: number, incidentId: number): Observable<ResponseModel<DemandModel>> {
        return this._dataService.Query()
            .Filter(`ApproverDepartmentId eq ${approverDeptId} and IncidentId eq ${incidentId} and
             IsClosed eq false and IsApproved eq false and IsRejected eq false and IsCompleted eq false`)
            .Expand('TargetDepartment($select=DepartmentName), RequesterDepartment($select=DepartmentName) , DemandType($select=DemandTypeName)')
            .Execute();
    };

    public GetCompletedDemands(deptId: number, incidentId: number): Observable<ResponseModel<DemandModel>> {
        return this._dataService.Query()
            .Filter(`RequesterDepartmentId eq ${deptId} and IncidentId eq ${incidentId} and IsClosed eq false and IsCompleted eq true and IsApproved eq true`)
            .Expand('TargetDepartment($select=DepartmentName), RequesterDepartment($select=DepartmentName), DemandType($select=DemandTypeName)')
            .Execute();
    };

    public CreateBulk(entities: DemandModel[]): Observable<DemandModel[]> {
        return this._bulkDataService.BulkPost(entities).Execute();
    };

    public DemandMapper(entities: DemandModel[]): DemandModelToView[] {
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

    public UpdateBulkForCompletion(entities: DemandModel[]): Observable<DemandModel[]> {
        return this._bulkDataServiceForCompletion.BulkPost(entities).Execute();
    };

    public UpdateBulkForApproval(entities: DemandModel[]): Observable<DemandModel[]> {
        return this._bulkDataServiceForApproval.BulkPost(entities).Execute();
    };

    public UpdateBulkForClosure(entities: DemandModel[]): Observable<DemandModel[]> {
        return this._bulkDataServiceForCompletion.BulkPost(entities).Execute();
    };
}