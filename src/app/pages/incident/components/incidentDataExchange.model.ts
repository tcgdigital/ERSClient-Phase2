import { NgModule } from '@angular/core';
import { BaseModel, KeyValue } from '../../../shared';
import { IncidentModel } from './incident.model';
import { FlightModel, InvolvePartyModel } from '../../shared.components';
import { DepartmentModel } from '../../masterdata';
import { AffectedModel } from "../../shared.components/affected/components/affected.model";

export class IncidentDataExchangeModel {
    public IncidentModel: IncidentModel;
    public InvolvedPartyModel?: InvolvePartyModel;
    public FLightModel?: FlightModel;
    public AffectedModel?: AffectedModel;
    public IsFlightRelated: boolean;
}