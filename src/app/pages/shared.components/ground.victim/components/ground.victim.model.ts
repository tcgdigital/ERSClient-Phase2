import { BaseModel } from '../../../../shared';
import { InvolvePartyModel } from '../../../shared.components';

export class GroundVictimModel extends BaseModel{
    GroundVictimId : number;
    InvolvedPartyId : number;
    GroundVictimType : string;
    GroundVictimName : string;
    AffectedCount? : number;
    Status : string;
    NOKName? : string;
    NOKContactNumber? : string;

    InvolvedParty? : InvolvePartyModel;
}