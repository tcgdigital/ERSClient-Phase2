import { NgModule } from '@angular/core';
import { BaseModel } from '../../../shared';


export class PeopleOnBoardModel extends BaseModel {
    public enquiredAffectedPassengerCount: number = 0;
    public totalAffectedPassengerCount: number = 0;
    public enquiredAffectedCrewCount: number = 0;
    public totalAffectedCrewCount: number = 0;
    
    constructor() {
        super();
        this.enquiredAffectedPassengerCount = 0;
        this.totalAffectedPassengerCount = 0;
        this.enquiredAffectedCrewCount = 0;
        this.totalAffectedCrewCount = 0;
    }
}