import { NgModule } from '@angular/core';
import { BaseModel } from '../../../shared';

export class PeopleOnBoardModel {
    public enquiredAffectedPassengerCount: number;
    public totalAffectedPassengerCount: number;
    public enquiredAffectedCrewCount: number;
    public totalAffectedCrewCount: number;

    constructor() {
        this.enquiredAffectedPassengerCount = 0;
        this.totalAffectedPassengerCount = 0;
        this.enquiredAffectedCrewCount = 0;
        this.totalAffectedCrewCount = 0;
    }
}