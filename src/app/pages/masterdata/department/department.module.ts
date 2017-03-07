import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SharedModule } from '../../../shared/shared.module';
import { DepartmentRouting } from './department.routing';
import { DepartmentComponent } from './department.component';
import { UserProfileService } from '../userprofile';
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
        SharedModule,
        DepartmentRouting
    ],
    declarations: [
        DepartmentEntryComponent,
        DepartmentListComponent,
        DepartmentComponent
    ],
    providers: [
        DepartmentService,
        UserProfileService
    ]
})
export class DepartmentModule { }