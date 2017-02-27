import { NgModule } from '@angular/core';
import { BaseModel,KeyValue } from '../../../../shared';
import { IncidentModel } from './incident.model';
import { InvolvedPartyModel } from '../../involvedParty/components/involvedParty.model';
import { FlightModel } from '../../flight/components/flight.model';
import { DepartmentModel } from '../../department/components/department.model';

export class IncidentDataExchangeModel {

    public IncidentModel: IncidentModel;
    public InvolvedPartyModel?: InvolvedPartyModel;
    public FLightModel?: FlightModel;
    public IsFlightRelated: boolean;

}