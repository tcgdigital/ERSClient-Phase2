import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { IncidentRouting } from './incident.routing';
import { IncidentComponent } from './incident.component';
import { IncidentEntryComponent,IncidentViewComponent,IncidentService } from './components';
import { DepartmentService } from '../masterdata/department';
import { EmergencyTypeService } from '../masterdata/emergencytype';
import { DataExchangeService } from '../../shared';
import { FlightService } from '../masterdata/flight';
import { InvolvedPartyService } from '../masterdata/involvedParty';

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
export class IncidentModule { }