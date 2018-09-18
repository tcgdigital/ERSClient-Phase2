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
import { PageFunctionalityHierarchyComponent } from './page.functionality.hierarchy.component';
import { AccordionModule } from 'ngx-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        MdCheckboxModule,
        SharedModule,
        AccordionModule.forRoot(),
        PageFunctionalityeRouting
    ],
    declarations: [
        PageFunctionalityComponent,
        PageFunctionalityHierarchyComponent
    ],
    providers: [
        PageService, 
        PagePermissionService,
        DepartmentService,
        DataExchangeService
    ]
})
export class PageFunctionalityModule { }