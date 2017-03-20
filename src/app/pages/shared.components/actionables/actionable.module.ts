import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { ActionableRouting } from './actionable.routing';
import { ActionableComponent } from './actionable.component';

import {
    ActionableActiveComponent,
    ActionableClosedComponent, ActionableService
} from './components';
import { DepartmentService, EmergencyTypeService } from '../../masterdata';
import { DataExchangeService, FileUploadService } from '../../../shared';
import { FlightService,InvolvePartyService } from '../../shared.components';
import { MomentModule } from 'angular2-moment';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        ActionableRouting,
        MdCheckboxModule,
        MomentModule
    ],
    declarations: [
        ActionableActiveComponent,
        ActionableClosedComponent,
        ActionableComponent
    ],
    providers: [
        ActionableService,
        DepartmentService,
        InvolvePartyService,
        FlightService,
        EmergencyTypeService,
        DataExchangeService,
        FileUploadService
    ]
})
export class ActionableModule { }