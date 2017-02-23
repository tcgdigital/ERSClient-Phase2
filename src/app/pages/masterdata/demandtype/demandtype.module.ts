import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { DemandTypeRouting } from './demandtype.routing';
import { DemandTypeComponent } from './demandtype.component';
import { DemandTypeEntryComponent, DemandTypeListComponent, DemandTypeService } from './components';
import { DepartmentService } from '../department';
import { DataExchangeService } from '../../../shared';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        MdCheckboxModule,
        DemandTypeRouting
    ],
    declarations: [
        DemandTypeEntryComponent,
        DemandTypeListComponent,
        DemandTypeComponent
    ],
    providers: [
        DemandTypeService,
        DepartmentService,
        DataExchangeService
    ]
})
export class DemandTypeModule { }