import { NgModule } from '@angular/core';
import { BaseModel } from '../../../shared';


export class DemandRaisedSummeryModel {
    public demandRaisedCount: number;
    public demandClosedCount: number;

    constructor() {
        this.demandRaisedCount = 0;
        this.demandClosedCount = 0;
    }
}