import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { PageFunctionalityeRouting } from './page.functionality.routing';
import { PageFunctionalityComponent } from './page.functionality.component';
import { PageService, PagePermissionService } from './components';
import { DepartmentService } from '../department';
import { DataExchangeService, SharedModule } from '../../../shared';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        MdCheckboxModule,
        SharedModule,
        PageFunctionalityeRouting
    ],
    declarations: [
        PageFunctionalityComponent
    ],
    providers: [
        PageService, 
        PagePermissionService,
        DepartmentService,
        DataExchangeService
    ]
})
export class PageFunctionalityModule { }