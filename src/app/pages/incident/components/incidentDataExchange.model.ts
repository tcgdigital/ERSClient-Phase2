import { NgModule } from '@angular/core';
import { BaseModel, KeyValue } from '../../../shared';
import { IncidentModel } from './incident.model';
import {  FlightModel,InvolvePartyModel } from '../../shared.components';
import { DepartmentModel } from '../../masterdata';

export class IncidentDataExchangeModel {
    public IncidentModel: IncidentModel;
    public InvolvedPartyModel?: InvolvePartyModel;
    public FLightModel?: FlightModel;
    public IsFlightRelated: boolean;
}