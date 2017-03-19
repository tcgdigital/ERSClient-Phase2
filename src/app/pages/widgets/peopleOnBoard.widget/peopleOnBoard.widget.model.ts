import { BaseModel } from '../../../shared';

export class PeopleOnBoardModel extends BaseModel {
    public EnquiredPassengerCount: number;
    public TotalPassengerCount: number;
    public EnquiredCrewCount: number;
    public TotalCrewCount: number;
}