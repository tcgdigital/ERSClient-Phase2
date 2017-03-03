import { BaseModel } from '../../../../shared';
import { IncidentModel } from '../../Incident';
import { AffectedModel } from '../../affecteds';
import { FlightModel } from '../../Flight';
 
 export class InvolvedPartyModel extends BaseModel {
       public InvolvedPartyId : number;
       public IncidentId : number;
       public InvolvedPartyType : string;
       public InvolvedPartyDesc : string;

       public IncidentModel : IncidentModel;

       public Affecteds ? : AffectedModel[] ;
       public Flights ? : FlightModel[];
}