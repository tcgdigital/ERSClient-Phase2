import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { IncidentRouting } from './incident.routing';
import { IncidentComponent } from './incident.component';
import { IncidentEntryComponent } from './components/incident.entry.component';
import { IncidentViewComponent } from './components/incident.view.component';
import { IncidentService } from './components/incident.service';
import { DepartmentService } from '../department/components/department.service';
import { EmergencyTypeService } from '../emergencyType/components/emergencyType.service';
import { BrowserModule } from '@angular/platform-browser';
import { DataExchangeService } from '../../../shared';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { FlightService } from '../flight/components/flight.service';
import { InvolvedPartyService } from '../involvedParty/components/involvedParty.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        IncidentRouting,
        MdCheckboxModule
    ],
    declarations: [
        IncidentEntryComponent,
        IncidentViewComponent,
        IncidentComponent
    ],
    providers: [
        IncidentService,
        DepartmentService,
        InvolvedPartyService,
        FlightService,
        EmergencyTypeService,
        DataExchangeService
    ]
})
export default class IncidentModule { }