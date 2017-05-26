import { NgModule } from '@angular/core';
import { BaseModel } from '../../../../shared';
import { FlightModel } from "../../../shared.components";

export class AircraftTypeModel extends BaseModel {
    public AircraftTypeId: number;
    public AircraftTypeCode: string;
    public AircraftTypeName: string;

    public Flight?: FlightModel[];
    
    
    constructor() {
        super();
        this.AircraftTypeId = 0;
        this.AircraftTypeCode = '';
        this.AircraftTypeName = '';
    }
}