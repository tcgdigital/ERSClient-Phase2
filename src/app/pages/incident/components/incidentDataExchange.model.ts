import { NgModule } from '@angular/core';
import { BaseModel,KeyValue } from '../../../shared';
import { IncidentModel } from './incident.model';
import { InvolvedPartyModel } from '../../masterdata/involvedParty';
import { FlightModel } from '../../masterdata/flight';
import { DepartmentModel } from '../../masterdata/department';

export class IncidentDataExchangeModel {

    public IncidentModel: IncidentModel;
    public InvolvedPartyModel?: InvolvedPartyModel;
    public FLightModel?: FlightModel;
    public IsFlightRelated: boolean;

}