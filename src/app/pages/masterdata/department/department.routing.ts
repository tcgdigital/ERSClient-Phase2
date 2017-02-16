import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepartmentComponent } from './department.component';

const departmentRoutes: Routes = [
    {
        path: '',
        component: DepartmentComponent,
    }
];

export const DepartmentRouting: ModuleWithProviders
    = RouterModule.forChild(departmentRoutes);