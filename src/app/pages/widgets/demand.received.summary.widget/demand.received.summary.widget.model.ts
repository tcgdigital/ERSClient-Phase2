import { NgModule } from '@angular/core';
import { BaseModel } from '../../../shared';


export class DemandReceivedSummeryModel {
    public demandAllocatedCount: number;
    public demandCompletedCount: number;

    constructor() {
        this.demandAllocatedCount = 0;
        this.demandCompletedCount = 0;
    }
}