import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { DepartmentRouting } from './department.routing';
import { DepartmentComponent } from './department.component';
import {
    DepartmentEntryComponent,
    DepartmentListComponent,
    DepartmentService
} from './components';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        DepartmentRouting
    ],
    declarations: [
        DepartmentEntryComponent,
        DepartmentListComponent,
        DepartmentComponent
    ],
    providers: [
        DepartmentService
    ]
})
export class DepartmentModule { }