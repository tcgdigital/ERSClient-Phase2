import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { ModalModule, ModalDirective } from 'ng2-bootstrap';
import { IncidentRouting } from './incident.routing';
import { IncidentComponent } from './incident.component';
import { EmergencyLocationService } from "../masterdata/emergencylocation";
import { IncidentEntryComponent, IncidentViewComponent, IncidentService } from './components';
import { DepartmentService, EmergencyTypeService } from '../masterdata';
import { SharedModule, DataExchangeService } from '../../shared';
import { FlightModule, InvolvePartyModule } from '../shared.components';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        MdCheckboxModule,
        SharedModule,
        FlightModule,
        InvolvePartyModule,
        IncidentRouting,
        ModalModule.forRoot(),    
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
        EmergencyLocationService,
        DataExchangeService
    ]
})
export class IncidentModule { }