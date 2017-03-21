import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { SharedModule } from '../../shared/shared.module';
import { MasterDateComponent } from './masterdata.component';
import { MasterDateRouting } from './masterdata.routing';

import {
    BroadcastDepartmentService,
    ChecklistService,
    DemandTypeService,
    DepartmentService,
    PageService,
    EmergencyTypeDepartmentService,
    EmergencySituationService,
    EmergencyTypeService,
    QuickLinkService,
    TemplateService,
    UserPermissionService,
    UserProfileService
} from './'

const MASTER_SERVICES: any[] = [
    BroadcastDepartmentService,
    ChecklistService,
    DemandTypeService,
    DepartmentService,
    PageService,
    EmergencyTypeDepartmentService,
    EmergencySituationService,
    EmergencyTypeService,
    QuickLinkService,
    TemplateService,
    UserPermissionService,
    UserProfileService
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        MdCheckboxModule,
        MasterDateRouting
    ],
    declarations: [
        MasterDateComponent
    ]
})
export class MasterDateModule {
    static expose(): ModuleWithProviders {
        let moduleProvider: ModuleWithProviders = <ModuleWithProviders>{
            ngModule: MasterDateModule,
            providers: [
                ...MASTER_SERVICES
            ]
        };
        return moduleProvider;
    }
}