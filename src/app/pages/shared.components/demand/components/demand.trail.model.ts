import { BaseModel } from '../../../../shared';
import { DemandTypeModel } from '../../../masterdata/demandtype';
import { IncidentModel } from '../../../incident';
import { DemandModel } from './demand.model';

export class DemandTrailModel extends BaseModel {
	public DemandTrailId: number;
	public Answers: string;
	public IncidentId: number;
	public DemandId: number;
	public DemandTypeId: number;
	public DemandCode: string;
	public ScheduleTime: string;
	public ContactNumber: string;
	public Priority: string;
	public RequiredLocation: string;
	public RequesterName: string;
	public RequesterDepartmentName: string;
	public RequesterParentDepartmentName: string;
	public TargetDepartmentName: string;
	public ApproverDepartmentName: string;
	public ApprovedByDepartmentName: string;
	public ClosedByDepartmentName: string;
	public RejectedByDepartmentName: string;
	public RequesterType: string;
	public DemandDesc: string;
	public IsApproved: boolean;
	public ApprovedDt?: Date;
	public IsCompleted: boolean;
	public ScheduledClose?: Date;
	public IsClosed: boolean;
	public ClosedOn?: Date;
	public IsRejected: boolean;
	public RejectedDate?: Date;
	public DemandStatusDescription: string;
	public Remarks: string;


	public Incident?: IncidentModel;
	public Demand?: DemandModel;
	public DemandType?: DemandTypeModel;

	constructor() {
		super();
	}
}
