import { BaseModel } from '../../../../shared';
import { FileStoreModel } from '../../../../shared/models/file.store.model';
import { CommunicationLogModel } from '../../../shared.components';
import { DemandTypeModel } from '../../../masterdata/demandtype';
import { DepartmentModel } from '../../../masterdata/department';
import { DemandTrailModel } from './demand.trail.model';
import { CallerModel } from '../../caller';
import { AffectedObjectModel } from '../../affected.objects';
import { AffectedPeopleModel } from '../../affected.people';

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
    public GroundVictimId?: number;
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
    public RequesterParentDepartment: DepartmentModel;
    public TargetDepartment: DepartmentModel;
    public ClosedByDepartment: DepartmentModel;
    public ApproverDepartment: DepartmentModel;
    public Caller: CallerModel;
    public AffectedPerson: AffectedPeopleModel;
    public AffectedObject: AffectedObjectModel;

    public DemandTrails?: DemandTrailModel[];
    public DemandRemarkLogs?: DemandRemarkLogModel[];
    public CommunicationLogs?: CommunicationLogModel[];
    public FileStores?: FileStoreModel[];

    constructor() {
        super();
    }
}

export class DemandModelToView extends BaseModel {
    public DemandId: number;
    public DemandTypeName: string;
    public DemandDesc: string;
    public DemandCode: string;
    public RequesterDepartmentName: string;
    public TargetDepartmentName: string;
    public Priority: string;
    public RequiredLocation: string;
    public ScheduleTime: string;
    public ScheduleTimeToShow: string;
    public EndTime: Date;
    public ElapseTime: number;
    public RagStatus: string;
    public IsRejected: boolean;
    public Remarks: string;
    public RequesterDepartmentId: number;
    public IsCompleted: boolean;
    public ContactNumber: string;
    public DemandStatusDescription: string;
    public RequestedBy: string;
    public ClosedOn: Date;
    public IsApproved: boolean;
    public AffectedPersonId: number;
    public AffectedObjectId: number;
    public AffectedPersonName: string;
    public AWB: string;
    public ReferenceNumber: string;
    public IsClosed: boolean;
    public ApproverDeptId: number;
    public ApproverDepartmentName: string;
    public RequesterParentDepartmentName: string;
    public RequesterType: string;
    public FileStores?: FileStoreModel[] = [];
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