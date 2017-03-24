import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { IncidentRouting } from './incident.routing';
import { IncidentComponent } from './incident.component';
import { IncidentEntryComponent, IncidentViewComponent, IncidentService } from './components';
import { DepartmentService, EmergencyTypeService } from '../masterdata';
import { SharedModule, DataExchangeService } from '../../shared';
// import { SharedComponentModule } from '../shared.components';
import { FlightModule, FlightService, InvolvePartyModule } from '../shared.components';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        MdCheckboxModule,
        SharedModule.forRoot(),
        FlightModule,
        InvolvePartyModule,

        IncidentRouting
        // SharedComponentModule
        // SharedComponentModule.forRoot()
    ],
    declarations: [
        IncidentEntryComponent,
        IncidentViewComponent,
        IncidentComponent
    ],
    providers: [
        IncidentService,
        // FlightService,
        DepartmentService,
        EmergencyTypeService,
        DataExchangeService
    ]
})
export class IncidentModule {
    // static forRoot(): ModuleWithProviders {
    //     let moduleProvider: ModuleWithProviders = <ModuleWithProviders>{
    //         ngModule: IncidentModule,
    //         providers: [
    //             IncidentService
    //         ]
    //     };
    //     return moduleProvider;
    // }
}