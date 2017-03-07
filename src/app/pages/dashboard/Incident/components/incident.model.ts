import { BaseModel } from '../../../../shared';
import { EmergencyTypeModel } from '../../../masterdata/emergencytype';
 
 export class IncidentModel extends BaseModel {
        public IncidentId : number;
        public IsDrill : number;
        public EmergencyTypeId : number;
        public IncidentStatus : string;
        public EmergencyName : string;
        public AlertMessage: string;
        public Description : string;
        public ClosureNote : string;
        public EmergencyDate : Date;
        public Severity : string;
        public EmergencyLocation: string;
        public IsSubmitted : boolean;
        public IsSaved : boolean;
        public Rks : string;
        public ClosedBy ? : number;
        public ClosedOn ? : Date;
        public ReOpenBy : number;
        public ReOpenOn ? : Date;
        public ReClosedBy : number;
        public ReClosedOn ? : Date;
        public SubmittedBy ? : number;
        public SubmittedOn ? : Date;
        public SavedBy ? : number;
        public SavedOn ? : Date;
        public DepartmentId : number;

        public EmergencyType : EmergencyTypeModel;
}