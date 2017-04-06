import { NgModule } from '@angular/core';
import { BaseModel } from '../../../shared';


export class CasualtySummeryModel {
    public criticalCasualtyCount: number;
    public deceasedCasualtyCount: number;
    public minorCasualtyCount: number;
    public reunitedCasualtyCount: number;

    constructor() {
        this.criticalCasualtyCount = 0;
        this.deceasedCasualtyCount = 0;
        this.minorCasualtyCount = 0;
        this.reunitedCasualtyCount = 0;
    }
}