import { BaseModel } from '../../../../shared';
import { CommunicationLogModel } from '../../../shared.components';

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


    public ParentDemand ?: DemandModel;
    public CommunicationLogs ? : CommunicationLogModel[];

    constructor() {
        super();
    }
}