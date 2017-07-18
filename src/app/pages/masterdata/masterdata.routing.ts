import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../shared/services';
import { MasterDateComponent } from './masterdata.component';

const pageRoutes: Routes = [
    {
        path: '',
        component: MasterDateComponent,
        canActivateChild: [AuthGuardService],
        children: [
            { path: 'department', loadChildren: './department/department.module#DepartmentModule' },
            { path: 'checklist', loadChildren: './checklist/checklist.module#ChecklistModule' },
            { path: 'demandtype', loadChildren: './demandtype/demandtype.module#DemandTypeModule' },
            { path: 'emergencytype', loadChildren: './emergencytype/emergencytype.module#EmergencyTypeModule' },
            { path: 'quicklink', loadChildren: './quicklink/quicklink.module#QuickLinkModule' },
            { path: 'emergencydepartment', loadChildren: './emergency.department/emergency.department.module#EmergencyDepartmentModule' },
            { path: 'template', loadChildren: './template/template.module#TemplateModule' },
            { path: 'userpermission', loadChildren: './userpermission/userpermission.module#UserPermissionModule' },
            { path: 'pagefunctionality', loadChildren: './page.functionality/page.functionality.module#PageFunctionalityModule' },
            { path: 'userprofile', loadChildren: './userprofile/userprofile.module#UserProfileModule' },
            { path: 'affectedstation', loadChildren: './emergencylocation/emergencylocation.module#EmergencyLocationModule' },
            { path: 'broadcastdepartment', loadChildren: './broadcastdepartment/boradcastdepartment.module#BroadcastDepartmentMappingModule' }
        ]
    }
];

export const MasterDateRouting: ModuleWithProviders
    = RouterModule.forChild(pageRoutes);