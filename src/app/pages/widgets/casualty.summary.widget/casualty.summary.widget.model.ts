import { NgModule } from '@angular/core';
import { BaseModel } from '../../../shared';


export class CasualtySummeryModel {
    public uninjuredCount: number;
    public injuredCount: number;
    public deceasedCount: number;
    public missingCount: number;
    public othersCount: number;

    constructor() {
        this.uninjuredCount = 0;
        this.injuredCount = 0;
        this.deceasedCount = 0;
        this.missingCount = 0;
        this.othersCount = 0;
    }
}

export class CasualtyExchangeModel extends BaseModel {
    public IncidentId: number;
    public MedicalStatus: string;
    public StatusCount: number;
}