//import { IncidentModel } from '../../pages/incident/components/incident.model';
//import { OrganizationModel } from '../../pages/shared.components/Organization/components/organization.model'
//import { DemandModel } from '../../pages/shared.components/demand/components/demand.model'
//import { DepartmentModel } from '../../pages/masterdata/department/components/department.model';
//import { ActionableModel } from '../../pages/shared.components/actionables/components/actionable.model'
//import { CrewModel } from '../../pages/shared.components/crew/components/crew.model'
import { BaseModel } from './base.model';


export class FileStoreModel extends BaseModel {
    public FileStoreID : number;
    public IncidentId : number;
    public OrganizationId : number;
    public DepartmentId : number;
    public DemandId? : number;
    public ActionId? : number;
    public CrewId? : number;
    public ModuleName : string;
    public UploadedFileName : string; 
    public FilePath : string;

    //public Incident : IncidentModel
    //public Organization : OrganizationModel;
    //public Department : DepartmentModel;
    //public Demand : DemandModel;
    //public Crew : CrewModel;
    //public Actionable : ActionableModel;
}