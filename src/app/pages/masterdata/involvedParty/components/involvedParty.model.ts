import { NgModule } from '@angular/core';
import { BaseModel, KeyValue } from '../../../../shared';
import { IncidentModel } from '../../../incident';

export class InvolvedPartyModel extends BaseModel {
    public InvolvedPartyId: number;
    public IncidentId: number;
    public InvolvedPartyType: string;
    public InvolvedPartyDesc: string;

    public Active: boolean;

    public Incident: IncidentModel;
}