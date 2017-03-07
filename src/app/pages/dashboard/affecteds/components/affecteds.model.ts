import { BaseModel } from '../../../../shared';
import { AffectedPeopleModel } from '../../affected.people';
import { AffectedObjectModel } from '../../affected.objects';
 
 export class AffectedModel extends BaseModel {
        public AffectedId : number;
        public InvolvedPartyId : number;
        public Severity : string;

        public AffectedPeople ? : AffectedPeopleModel[];
        public AffectedObjects ? : AffectedObjectModel[];
}