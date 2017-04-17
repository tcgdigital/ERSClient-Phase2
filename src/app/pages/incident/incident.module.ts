import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { AgmCoreModule } from '@agm/core';

import { IncidentRouting } from './incident.routing';
import { IncidentComponent } from './incident.component';
import { IncidentEntryComponent, IncidentViewComponent, IncidentService } from './components';
import { DepartmentService, EmergencyTypeService } from '../masterdata';
import { SharedModule, DataExchangeService, LocationService } from '../../shared';
import { FlightModule, InvolvePartyModule } from '../shared.components';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        MdCheckboxModule,
        SharedModule,
        AgmCoreModule,
        FlightModule,
        InvolvePartyModule,
        IncidentRouting
    ],
    declarations: [
        IncidentEntryComponent,
        IncidentViewComponent,
        IncidentComponent
    ],
    providers: [
        IncidentService,
        DepartmentService,
        EmergencyTypeService,
        DataExchangeService,
        LocationService
    ]
})
export class IncidentModule { }