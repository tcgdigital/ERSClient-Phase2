import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../shared/shared.module';
import { ModalModule, ModalDirective } from 'ng2-bootstrap';
import { DashboardRouting } from './dashboard.routing';
import { DashboardComponent } from './dashboard.component';
import { WidgetModule } from '../widgets';
import { IncidentService } from '../incident';
import { DepartmentService } from '../masterdata/department';
import { MdCheckboxModule } from '@angular2-material/checkbox';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MdCheckboxModule,
        HttpModule,
        SharedModule,
        WidgetModule,
        DashboardRouting,
        ModalModule.forRoot(),
    ],
    declarations: [
        DashboardComponent
    ],
    providers: [
        IncidentService,
        DepartmentService
    ]
})
export class DashboardModule { }