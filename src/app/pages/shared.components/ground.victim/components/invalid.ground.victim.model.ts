import { BaseModel } from '../../../../shared';
import { InvolvePartyModel } from '../../../shared.components';

export class InvalidGroundVictimModel extends BaseModel{
    InvalidGroundVictimId : number;
    InvolvedPartyId : number;
    InvalidGroundVictimType? : string;
    InvalidGroundVictimName? : string;
    AffectedCount? : number;
    Status? : string;
    NOKName? : string;
    NOKContactNumber? : string;
    ErrorReason? : string;

    InvolvedParty? : InvolvePartyModel;
}