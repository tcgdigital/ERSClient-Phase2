import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../shared/shared.module';

import { ArchiveDashboardRouting } from './archive.dashboard.routing';
import { ArchiveDashboardComponent } from './archive.dashboard.component';
import { WidgetModule } from '../widgets';
import { IncidentService } from '../incident';
import { DepartmentService } from '../masterdata/department';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        SharedModule,
        WidgetModule,
        ArchiveDashboardRouting
    ],
    declarations: [
        ArchiveDashboardComponent
    ],
    providers: [
        IncidentService,
        DepartmentService
    ]
})
export class ArchiveDashboardModule { }
