import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterDateComponent } from './masterdata.component';
// import { LoginComponent } from './login';
// import { DepartmentComponent } from './department';

const pageRoutes: Routes = [
    {
        path: '',
        component: MasterDateComponent,
        children: [
            { path: 'department', loadChildren: './department/department.module#DepartmentModule' },
            { path: 'checklist', loadChildren: './checklist/checklist.module#ChecklistModule' },
            { path: 'demandtype', loadChildren: './demandtype/demandtype.module#DemandTypeModule' },
            { path: 'emergencytype', loadChildren: './emergencytype/emergencytype.module#EmergencyTypeModule' }
        ]
    }
];

export const MasterDateRouting: ModuleWithProviders
    = RouterModule.forChild(pageRoutes);