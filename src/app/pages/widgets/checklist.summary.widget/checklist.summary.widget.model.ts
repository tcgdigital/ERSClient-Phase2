import { NgModule } from '@angular/core';
import { BaseModel } from '../../../shared';


export class CheckListSummeryModel extends BaseModel {
    public openActionableCount: number = 0;
    public closeActionableCount: number = 0;
    
    constructor() {
        super();
    
        this.openActionableCount = 0;
        this.closeActionableCount = 0;
    }
}