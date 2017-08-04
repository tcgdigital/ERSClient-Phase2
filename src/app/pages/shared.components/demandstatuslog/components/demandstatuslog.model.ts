import { BaseModel } from '../../../../shared';
import { IncidentModel } from "../../../incident";
import { DemandModel } from "../../../shared.components/demand";
import { DepartmentModel } from "../../../masterdata/department";

export class DemandStatusLogModel extends BaseModel {
	public DemandStatusLogId: number;
	public DemandId: number;
	public IncidentId: number;
	public DemandStatusDescription: string;
    public DemandStatusDescriptionChangedOn: Date;
    
    public Incident: IncidentModel;
	public Demand: DemandModel;
	public TargetDepartment: DepartmentModel;
	public RequesterDepartment: DepartmentModel;

	/**
	 * Creates an instance of CargoModel.
	 * 
	 * @memberOf CargoModel
	 */
	constructor() {
		super();
		this.DemandStatusLogId = 0;
		this.DemandId = 0;
		this.IncidentId = 0;
		this.DemandStatusDescription = '';
		this.DemandStatusDescriptionChangedOn = new Date();
	}
}