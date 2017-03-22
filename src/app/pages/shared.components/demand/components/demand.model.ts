import { BaseModel } from '../../../../shared';
import { CommunicationLogModel } from '../../../shared.components';
import { DemandTypeModel } from '../../../masterdata/demandtype';
import { DepartmentModel } from '../../../masterdata/department';
import { DemandTrailModel } from './demand.trail.model';
import { CallerModel } from '../../caller';

export class DemandModel extends BaseModel {
    public DemandId: number;
    public DemandTypeId: number;
    public DemandCode: string;
    public DemandRefId?: number;
    public IncidentId: number;
    public AffectedId?: number;
    public AffectedSituationId?: number;
    public AffectedPersonId?: number;
    public AffectedObjectId?: number;
    public CallerId?: number;
    public TargetDepartmentId: number;
    public RequesterDepartmentId?: number;
    public RequesterParentDepartmentId?: number;
    public ApproverDepartmentId?: number;
    public AWB: string;
    public PDATicketNumber: string;
    public DemandDesc: string;
    public IsApproved: boolean;
    public ApprovedBy?: number;
    public ApprovedDt?: Date;
    public RequestedBy: string;
    public RequesterType: string;
    public DemandStatusDescription: string;
    public ScheduleTime: string;
    public Remarks: string;
    public IsClosed: boolean;
    public ClosedBy?: number;
    public ClosedOn?: Date;
    public ScheduledClose?: Date;
    public ContactNumber?: string;
    public Priority: string;
    public RequiredLocation: string;
    public IsRejected: boolean;
    public IsCompleted: boolean;
    public RejectedBy?: number;
    public RejectedDate?: Date;
    public ClosedByDepartmentId?: number;


    public ParentDemand?: DemandModel;
    public DemandType: DemandTypeModel;
    public RequesterDepartment: DepartmentModel;
    public TargetDepartment: DepartmentModel;
    public ClosedByDepartment: DepartmentModel;
    public ApproverDepartment: DepartmentModel;
    public Caller : CallerModel;

    public DemandTrails?: DemandTrailModel[];
    public DemandRemarkLogs?: DemandRemarkLogModel[];
    public CommunicationLogs?: CommunicationLogModel[];

    constructor() {
        super();
    }

}

export class DemandModelToView {

    public DemandId: number;
    public DemandTypeName: string;
    public DemandDesc: string;
    public RequesterDepartmentName: string;
    public TargetDepartmentName: string;
    public Priority: string;
    public RequiredLocation: string;
    public ScheduleTime: string;
    public EndTime: Date;
    public ElapseTime: number;
    public RagStatus: string;
    public IsRejected: boolean;
    public Remarks: string;
    public RequesterDepartmentId: number;
    public IsCompleted: boolean;
    public CreatedOn: Date;
    public ContactNumber: string;
    public DemandStatusDescription: string;
    public RequestedBy: string;
    public ClosedOn: Date;
    public IsApproved: boolean;
    public AffectedPersonId: number;
    public AffectedObjectId: number;
    public IsClosed: boolean;
}

export class DemandRemarkLogModel extends BaseModel {
    public DemandRemarkLogId: number;
    public Remark: string;
    public DemandId: number;
    public RequesterDepartmentName: string;
    public TargetDepartmentName: string;
    public CreatedByName: string;

    public Demand?: DemandModel;

    constructor() {
        super();
        this.DemandRemarkLogId = 0;
    }
}