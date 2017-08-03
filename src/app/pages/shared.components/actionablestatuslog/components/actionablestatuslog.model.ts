import { BaseModel } from '../../../../shared';
import { IncidentModel } from "../../../incident";
import { ActionableModel } from "../../../shared.components/actionables";
import { ChecklistModel } from "../../../masterdata/checklist";

export class ActionableStatusLogModel extends BaseModel {
	public ActionableStatusLogId: number;
	public ChklistId: number;
	public IncidentId: number;
	public ActionId: number;
	public CompletionStatus: number;
    public CompletionStatusChangedOn: Date;
    
    public Incident: IncidentModel;
    public Actionable: ActionableModel;
    public CheckList: ChecklistModel;

	/**
	 * Creates an instance of CargoModel.
	 * 
	 * @memberOf CargoModel
	 */
	constructor() {
		super();
		this.ActionableStatusLogId = 0;
		this.ChklistId = 0;
		this.IncidentId = 0;
		this.ActionId = 0;
		this.CompletionStatus = 0;
		this.CompletionStatusChangedOn = new Date();
	}
}