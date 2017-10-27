import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { BroadcastDepartmentRouting } from './boradcast.department.routing';
import { BroadcastDepartmentComponent } from './boradcast.department.component';
import {
    BroadcastDepartmentService
} from './components';
import { BrowserModule } from '@angular/platform-browser';
import { DataExchangeService, SharedModule } from '../../../shared';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        MdCheckboxModule,
        SharedModule,
        ReactiveFormsModule,
        BroadcastDepartmentRouting
    ],
    declarations: [
        BroadcastDepartmentComponent
    ],
    providers: [
        BroadcastDepartmentService,
        DataExchangeService
    ]
})
export class BroadcastDepartmentMappingModule { }