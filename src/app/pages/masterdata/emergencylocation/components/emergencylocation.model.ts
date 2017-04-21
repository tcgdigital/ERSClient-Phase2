import { NgModule } from '@angular/core';
import { BaseModel } from '../../../../shared';

export class EmergencyLocationModel extends BaseModel {

    public EmergencyLocationId: number;
    public City: string;
    public IATA: string;
    public AirportName: string;
    public Active: boolean;

    constructor() {
        super();
        this.EmergencyLocationId = 0;
        this.City = '';
        this.IATA = '';
        this.AirportName = '';
        this.Active = false;
    }
}