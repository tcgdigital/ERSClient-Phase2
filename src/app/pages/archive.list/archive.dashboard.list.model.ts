import { NgModule } from '@angular/core';
import { BaseModel, KeyValue } from '../../shared';
import { IncidentModel } from '../incident/components/incident.model';

export class ArchiveDashboardListModel extends BaseModel {
    public IncidentModel: IncidentModel;
    

    constructor() {
        super();
        this.IncidentModel = new IncidentModel();
    }
}

