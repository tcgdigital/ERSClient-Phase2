import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { BroadcastRouting } from './broadcast.routing';
import { BroadcastComponent } from './broadcast.component';
import { BroadcastEntryComponent, BroadcastListComponent, BroadcastService } from './components';
import { BroadcastDepartmentService } from '../../masterdata/broadcast.department';
import { DepartmentService } from '../../masterdata/department';
import { BrowserModule } from '@angular/platform-browser';
import { DataExchangeService } from '../../../shared';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        BroadcastRouting        
    ],
    declarations: [
        BroadcastEntryComponent,
        BroadcastListComponent,
        BroadcastComponent
    ],
    providers: [
        BroadcastDepartmentService,
        DataExchangeService,
        BroadcastService,
        DepartmentService
    ]
})
export class BroadcastModule { }