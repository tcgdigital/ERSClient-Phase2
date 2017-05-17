import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { ChecklistRouting } from './checklist.routing';
import { ChecklistComponent } from './checklist.component';
import {
    ChecklistEntryComponent,
    ChecklistListComponent,
    ChecklistService
} from './components';
import { DepartmentService } from '../department';
import { EmergencyTypeService } from '../emergencytype';
import { DataExchangeService, SharedModule } from '../../../shared';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        MdCheckboxModule,
        ChecklistRouting,
        SharedModule
    ],
    declarations: [
        ChecklistEntryComponent,
        ChecklistListComponent,
        ChecklistComponent
    ],
    providers: [
        ChecklistService,
        DepartmentService,
        EmergencyTypeService,
        DataExchangeService
    ]
})
export class ChecklistModule { }