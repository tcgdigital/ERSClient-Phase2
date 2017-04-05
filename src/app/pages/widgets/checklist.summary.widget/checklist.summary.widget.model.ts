import { NgModule } from '@angular/core';
import { BaseModel } from '../../../shared';


export class CheckListSummeryModel {
    public openActionableCount: number;
    public closeActionableCount: number;

    constructor() {
        this.openActionableCount = 0;
        this.closeActionableCount = 0;
    }
}