import { Injectable, Output, EventEmitter } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { DemandModel, DemandModelToView } from './demand.model';
import { IDemandService } from './IDemandService';
import * as moment from 'moment/moment';

import {
    ResponseModel, DataService,
    DataServiceFactory, DataProcessingService, ServiceBase,
    IServiceInretface, BaseModel, RequestModel, GlobalConstants, WEB_METHOD

} from '../../../../shared';
import { DemandReceivedSummaryModel } from '../../../widgets/demand.received.summary.widget';
import {
    DepartmentAccessOwnerModel,
    DepartmentAccessOwnerService
} from '../../../shared.components/departmentaccessowner';


@Injectable()
export class DemandService extends ServiceBase<DemandModel> implements IDemandService {
    public departmentAccessOwnerModels: DepartmentAccessOwnerModel[];

    private _bulkDataService: DataService<DemandModel>;
    private _bulkDataServiceForCompletion: DataService<DemandModel>;
    private _bulkDataServiceForApproval: DataService<DemandModel>;
    private _batchDataService: DataService<DemandModel>;
    private _bulkDataServiceForClosure: DataService<DemandModel>;

    /**
     * Creates an instance of DemandService.
     * @param {DataServiceFactory} dataServiceFactory
     *
     * @memberOf DemandService
     */
    constructor(private dataServiceFactory: DataServiceFactory,
        private departmentAccessOwnerService: DepartmentAccessOwnerService) {
        super(dataServiceFactory, 'Demands');
        const option: DataProcessingService = new DataProcessingService();
        this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<DemandModel>
            ('DemandBatch', 'BatchPostAsync', option);
        this._bulkDataServiceForCompletion = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<DemandModel>
            ('DemandCompletionBatch', '', option);
        this._bulkDataServiceForApproval = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<DemandModel>
            ('DemandApproveBatch', '', option);
        this._bulkDataServiceForClosure = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<DemandModel>
            ('DemandClosureBatch', '', option);
        this._batchDataService = this.dataServiceFactory
            .CreateServiceWithOptions<DemandModel>('', option);
    }

    public GetAll(): Observable<ResponseModel<DemandModel>> {
        return this._dataService.Query()
            .Expand('ApproverDepartment($select=DepartmentName)').Execute();
    }

    public GetForAssignedDept(targetDeptId: number, incidentId: number): Observable<ResponseModel<DemandModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq ${incidentId} and TargetDepartmentId eq ${targetDeptId}  and IsClosed eq false and IsApproved eq true and IsCompleted eq false and ActiveFlag eq 'Active'`)
            .Expand('TargetDepartment($select=DepartmentName),RequesterDepartment($select=DepartmentName) , DemandType($select=DemandTypeName), RequesterParentDepartment($select=DepartmentName),AffectedPerson($select=TicketNumber;$expand=Passenger($select = PassengerName),Crew($select=CrewName)),AffectedObject($select=AWB,TicketNumber), FileStores')
            .Execute();
    }

    GetByDemandId(id: string | number): Observable<ResponseModel<DemandModel>> {
        return this._dataService.Query()
            .Filter(`DemandId eq ${id}`)
            .Expand('Caller')
            .Execute();
    }

    public GetByRequesterDepartment(requesterDeptId: number, incidentId: number): Observable<ResponseModel<DemandModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${incidentId} and RequesterDepartmentId eq ${requesterDeptId} and ActiveFlag eq 'Active'`)
            .Expand('TargetDepartment($select=DepartmentName) , DemandType($select=DemandTypeName) ,RequesterDepartment($select=DepartmentName),AffectedPerson($select=TicketNumber;$expand=Passenger($select = PassengerName),Crew($select=CrewName)),AffectedObject($select=AWB,TicketNumber), FileStores')
            .Execute();
    }

    public GetByApproverDepartment(approverDeptId: number, incidentId: number): Observable<ResponseModel<DemandModel>> {
        return this._dataService.Query()
            .Filter(`ApproverDepartmentId eq ${approverDeptId} and IncidentId eq ${incidentId} and
             IsClosed eq false and IsApproved eq false and IsRejected eq false and IsCompleted eq false and ActiveFlag eq 'Active'`)
            .Expand('TargetDepartment($select=DepartmentName), RequesterDepartment($select=DepartmentName) , DemandType($select=DemandTypeName), RequesterParentDepartment($select=DepartmentName),AffectedPerson($select=TicketNumber;$expand=Passenger($select = PassengerName),Crew($select=CrewName)),AffectedObject($select=AWB,TicketNumber), FileStores')
            .Execute();
    }

    public GetCompletedDemands(deptId: number, incidentId: number): Observable<ResponseModel<DemandModel>> {
        return this._dataService.Query()
            .Filter(`RequesterDepartmentId eq ${deptId} and IncidentId eq ${incidentId} and IsClosed eq false and IsCompleted eq true and IsApproved eq true and ActiveFlag eq 'Active'`)
            .Expand('TargetDepartment($select=DepartmentName), RequesterDepartment($select=DepartmentName) ,RequesterParentDepartment($select=DepartmentName), DemandType($select=DemandTypeName),AffectedPerson($select=TicketNumber;$expand=Passenger($select = PassengerName),Crew($select=CrewName)),AffectedObject($select=AWB,TicketNumber), FileStores')
            .Execute();
    }

    public CreateBulk(entities: DemandModel[]): Observable<DemandModel[]> {
        return this._bulkDataService.BulkPost(entities).Execute();
    }

    public DemandMapper(entities: DemandModel[]): DemandModelToView[] {
        let demandModelToView: DemandModelToView[];
        demandModelToView = entities.map((demand) => {
            const item = new DemandModelToView();
            const scheduleTime = demand.ScheduleTime;
            const createdOn = new Date(demand.CreatedOn);
            const timediff = createdOn.getTime() + (+scheduleTime) * 60000;
            const resolutiontime = new Date(timediff);
            item.ScheduleTimeToShow = moment(resolutiontime).format('DD-MMM-YYYY hh:mm A');
            item.DemandId = demand.DemandId;
            item.DemandTypeName = demand.DemandType.DemandTypeName;
            item.DemandDesc = demand.DemandDesc;
            item.RequesterDepartmentName = (!demand.RequesterDepartment) ? ' ' : demand.RequesterDepartment.DepartmentName;
            item.RequesterParentDepartmentName = (!demand.RequesterParentDepartment) ? '' : demand.RequesterParentDepartment.DepartmentName;
            item.Priority = demand.Priority;
            item.RequiredLocation = demand.RequiredLocation;
            item.ScheduleTime = demand.ScheduleTime;
            item.EndTime = new Date(new Date(demand.CreatedOn).getTime() + (+demand.ScheduleTime) * 60000);
            item.ElapseTime = new Date().getTime() - new Date(demand.CreatedOn).getTime();
            item.RagStatus = 'statusGreen';
            item.IsRejected = demand.IsRejected;
            item.Remarks = demand.Remarks;
            item.DemandCode = demand.DemandCode;
            item.RequesterDepartmentId = demand.RequesterDepartmentId;
            item.IsCompleted = demand.IsCompleted;
            item.CreatedOn = demand.CreatedOn;
            item.ContactNumber = demand.ContactNumber;
            item.DemandStatusDescription = demand.DemandStatusDescription;
            item.TargetDepartmentName = (!demand.TargetDepartment) ? '' : demand.TargetDepartment.DepartmentName;
            item.RequestedBy = demand.RequestedBy;
            item.ClosedOn = demand.ClosedOn;
            item.AffectedObjectId = demand.AffectedObjectId;
            item.AffectedPersonId = demand.AffectedPersonId;
            item.IsClosed = demand.IsClosed;
            item.ApproverDeptId = demand.ApproverDepartmentId;
            item.CreatedBy = demand.CreatedBy;
            item.CreatedOn = demand.CreatedOn;
            item.FileStores = demand.FileStores;
            item.RequesterType = demand.RequesterType;
            if (demand.AffectedPersonId != null) {
                item.AffectedPersonName = demand.AffectedPerson.Passenger != null ?
                    demand.AffectedPerson.Passenger.PassengerName : (demand.AffectedPerson.Crew != null ? demand.AffectedPerson.Crew.CrewName : '');
                item.ReferenceNumber = demand.AffectedPerson.TicketNumber;
            }
            else {
                item.AffectedPersonName = '';
            }
            if (demand.AffectedObjectId != null) {
                item.AWB = demand.AffectedObject.AWB;
                item.ReferenceNumber = demand.AffectedObject.TicketNumber;

            } else {
                item.AWB = '';
            }

            return item;
        });
        return demandModelToView;
    }

    public UpdateBulkForCompletion(entities: DemandModel[]): Observable<DemandModel[]> {
        return this._bulkDataServiceForCompletion.BulkPost(entities).Execute();
    }

    public UpdateBulkForApproval(entities: DemandModel[]): Observable<DemandModel[]> {
        return this._bulkDataServiceForApproval.BulkPost(entities).Execute();
    }

    public UpdateBulkForClosure(entities: DemandModel[]): Observable<DemandModel[]> {
        return this._bulkDataServiceForClosure.BulkPost(entities).Execute();
    }

    public UpdateBulkToDeactivateFromCallId(callId: number): Observable<DemandModel[]> {
        const option = new DataProcessingService();
        const bulkDataServiceToDeactivate = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<DemandModel>
            ('DemandBatch', `BatchDeactivate/${callId}`, option);
        return bulkDataServiceToDeactivate.JsonPost(callId).Execute();
    }

    public GetDepartmentIdProjection(departmentId: number): Observable<ResponseModel<DepartmentAccessOwnerModel>> {
        const departmentIdProjection: string = '';
        const departmentIds: number[] = [];
        return this.departmentAccessOwnerService.GetDependentDepartmentAccessOwners(departmentId);
    }

    public GetDemandByTargetDepartments(incidentId: number, departmentIdProjection: string): Observable<ResponseModel<DemandModel>> {
        const demandprojection: string = `DemandId,TargetDepartmentId,RequesterDepartmentId,IsCompleted,
        ClosedOn,ScheduleTime,CreatedOn,DemandDesc,IsClosed,DemandStatusDescription`;
        return this._dataService.Query()
            .Expand('TargetDepartment($select=DepartmentId,DepartmentName),RequesterDepartment($select=DepartmentId,DepartmentName)')
            .Filter(`IncidentId eq ${incidentId} and ActiveFlag eq 'Active' and ${departmentIdProjection}`)
            .Select(`${demandprojection}`)
            .Execute();

    }

    public GetDemandByRequesterDepartments(incidentId: number, departmentIdProjection: string): Observable<ResponseModel<DemandModel>> {
        const demandprojection: string = `DemandId,TargetDepartmentId,RequesterDepartmentId,IsCompleted,
        ClosedOn,ScheduleTime,CreatedOn,DemandDesc,IsClosed,DemandStatusDescription`;
        return this._dataService.Query()
            .Expand('TargetDepartment($select=DepartmentId,DepartmentName),RequesterDepartment($select=DepartmentId,DepartmentName)')
            .Filter(`IncidentId eq ${incidentId} and ActiveFlag eq 'Active' and ${departmentIdProjection}`)
            .Select(`${demandprojection}`)
            .Execute();

    }

    public GetDemandByIncident(incidentId: number): Observable<ResponseModel<DemandModel>> {
        const demandprojection: string = `DemandId,RequesterDepartmentId,TargetDepartmentId,IsClosed,ClosedOn,ScheduleTime,CreatedOn,DemandDesc`;
        return this._dataService.Query()
            .Expand('TargetDepartment($select=DepartmentId,DepartmentName),RequesterDepartment($select=DepartmentId,DepartmentName)')
            .Filter(`IncidentId eq ${incidentId} and ActiveFlag eq 'Active'`)
            .Select(`${demandprojection}`)
            .Execute();

    }

    public GetDemandByRequesterDepartment(incidentId: number, departmentId: number): Observable<ResponseModel<DemandModel>> {
        const demandprojection: string = `DemandId,RequesterDepartmentId,TargetDepartmentId,IsClosed,ClosedOn,ScheduleTime,CreatedOn,DemandDesc`;
        return this._dataService.Query()
            .Expand('TargetDepartment($select=DepartmentId,DepartmentName),RequesterDepartment($select=DepartmentId,DepartmentName)')
            .Filter(`IncidentId eq ${incidentId} and ActiveFlag eq 'Active' and RequesterDepartmentId eq ${departmentId} and ActiveFlag eq 'Active'`)
            .Select(`${demandprojection}`)
            .Execute();

    }

    public GetDemandByTargetDepartment(incidentId: number, departmentId: number): Observable<ResponseModel<DemandModel>> {
        const demandprojection: string = `DemandId,RequesterDepartmentId,TargetDepartmentId,IsClosed,ClosedOn,ScheduleTime,CreatedOn,DemandDesc`;
        return this._dataService.Query()
            .Expand('TargetDepartment($select=DepartmentId,DepartmentName),RequesterDepartment($select=DepartmentId,DepartmentName)')
            .Filter(`IncidentId eq ${incidentId} and ActiveFlag eq 'Active' and TargetDepartmentId eq ${departmentId} and ActiveFlag eq 'Active'`)
            .Select(`${demandprojection}`)
            .Execute();

    }

    public BatchGet(incidentId: number, departmentIds: number[]): Observable<ResponseModel<DemandModel>> {
        const requests: Array<RequestModel<DemandModel>> = [];
        let filterString: string = '';
        departmentIds.forEach((item, index) => {
            if (departmentIds.length > 1) {
                if (index === 0)
                    filterString = `(RequesterDepartmentId eq ${item})`;
                else
                    filterString = filterString + ` or (RequesterDepartmentId eq ${item})`;
            }
            else
                filterString = `RequesterDepartmentId eq ${item}`;
        });
        requests.push(new RequestModel<DemandModel>
            (`/odata/Demands?$filter=IncidentId eq ${incidentId} and (${filterString}) and ActiveFlag eq 'Active'`, WEB_METHOD.GET));

        return this._batchDataService.BatchPost<DemandModel>(requests)
            .Execute() as Observable<ResponseModel<DemandModel>>;
    }
}