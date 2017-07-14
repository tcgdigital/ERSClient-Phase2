import { BaseModel } from '../../../../shared';
import { ActionableModel } from '../../../shared.components';
import { IncidentModel } from "../../../incident";
import { ChecklistModel } from "../../../masterdata/checklist";
import { DepartmentModel } from "../../../masterdata/department";

export class ChecklistTrailModel extends BaseModel {
	public ChecklistTrailId: number;
	public ActionId: number;
	public ChklistId: number;
	public IncidentId: number;
	public CompletionStatus: string;
	public CompletionStatusChangedOn: Date;
	public CompletionStatusChangedBy: number;
	public DepartmentId: number;
	public Query: string;

	public Incident: IncidentModel;
	public Checklist: ChecklistModel;
	public Actionable: ActionableModel;
	public Department: DepartmentModel;


	/**
	 * Creates an instance of ChecklistTrailModel.
	 * 
	 * @memberOf ChecklistTrailModel
	 */
	constructor() {
		super();
		this.ChecklistTrailId = 0;
		this.ActionId = 0;
		this.ChklistId = 0;
		this.IncidentId = 0;
		this.CompletionStatus = '';
		this.CompletionStatusChangedOn = new Date();
		this.CompletionStatusChangedBy = 0;
		this.DepartmentId = 0;
		this.Query = '';
	}
}