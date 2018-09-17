import { BaseModel } from '../../../../shared';
import { InvolvePartyModel } from '../../../shared.components';

export class GroundVictimModel extends BaseModel{
    public GroundVictimId : number;
    public InvolvedPartyId : number;
    public GroundVictimType : string;
    public GroundVictimName : string;
    public AffectedCount? : number;
    public Status : string;
    public NOKName? : string;
    public NOKContactNumber? : string;

    public InvolvedParty? : InvolvePartyModel;
}

export class AffectedVictimToView extends BaseModel {
    public AffectedId: number;
    public InvolvedPartyId : number;
    public GroundVictimId: number;
    public GroundVictimName : string;
    public GroundVictimType : string;
    public AffectedCount: number;
    public NOKName : string;
    public NOKContactNumber : string;
}