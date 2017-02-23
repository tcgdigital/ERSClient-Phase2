import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { EmergencyDepartmentypeRouting } from './emergency.department.routing';
import { EmergencyDepartmentComponent } from './emergency.department.component';
import { EmergencyTypeDepartmentService } from './components';
import { EmergencyTypeService } from '../emergencytype';
import { DepartmentService } from '../department';
import { DataExchangeService, SharedModule } from '../../../shared';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        MdCheckboxModule,
        SharedModule,
        EmergencyDepartmentypeRouting
    ],
    declarations: [
        EmergencyDepartmentComponent
    ],
    providers: [
        EmergencyTypeService,
        DepartmentService,
        DataExchangeService,
        EmergencyTypeDepartmentService
    ]
})
export class EmergencyDepartmentModule { }