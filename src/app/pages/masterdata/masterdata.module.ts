import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { MasterDateComponent } from './masterdata.component';
// import { DepartmentComponent, DepartmentEntryComponent, DepartmentListComponent } from './department';
import { MasterDateRouting } from './masterdata.routing';
// import { DepartmentModule } from './department/department.module'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        // DepartmentModule,
        MasterDateRouting
    ],
    declarations: [
        MasterDateComponent
        // DepartmentEntryComponent,
        // DepartmentListComponent,
        // DepartmentComponent
    ]
})
export class MasterDateModule {
}