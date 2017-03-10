import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { BroadcastDepartmentRouting } from './boradcast.department.routing';
import { BroadcastDepartmentComponent } from './boradcast.department.component';
import {
    BroadcastDepartmentEntryComponent,
    BroadCastDepartmentListComponent, BroadcastDepartmentService
} from './components';
import { BrowserModule } from '@angular/platform-browser';
import { DataExchangeService } from '../../../shared';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        BroadcastDepartmentRouting
    ],
    declarations: [
        BroadcastDepartmentComponent,
        BroadcastDepartmentEntryComponent,
        BroadCastDepartmentListComponent
    ],
    providers: [
        BroadcastDepartmentService,
        DataExchangeService
    ]
})
export default class BroadcastDepartmentMappingModule { }