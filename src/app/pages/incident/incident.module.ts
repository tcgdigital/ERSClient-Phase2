import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { ModalModule } from 'ngx-bootstrap';
import { NgxMaskModule } from 'ngx-mask'
import { AgmCoreModule } from '@agm/core';
import { ToastrService } from 'ngx-toastr';
import { IncidentRouting } from './incident.routing';
import { IncidentComponent } from './incident.component';
import { EmergencyLocationService } from '../masterdata/emergencylocation';
import { IncidentEntryComponent, IncidentViewComponent, IncidentService } from './components';
import { DepartmentService, EmergencyTypeService } from '../masterdata';
import { SharedModule, DataExchangeService, LocationService } from '../../shared';
import { FlightModule, InvolvePartyModule, OrganizationService, AircraftTypeService } from '../shared.components';
import { TimeZoneService } from "../shared.components/timezone";
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
        IncidentRouting,
        ModalModule.forRoot(),
        NgxMaskModule.forRoot({
            clearIfNotMatch: true,
            dropSpecialCharacters: false
        })
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
        DataExchangeService,
        LocationService,
        ToastrService,
        OrganizationService,
        AircraftTypeService,
        TimeZoneService
    ]
})
export class IncidentModule { }