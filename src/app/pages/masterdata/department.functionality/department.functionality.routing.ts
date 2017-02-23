import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepartmentFunctionalityComponent } from './department.functionality.component';

const departmentFunctionalityRoutes: Routes = [
    {
        path: '',
        component: DepartmentFunctionalityComponent,
    }
];

export const DepartmentFunctionalityeRouting: ModuleWithProviders
    = RouterModule.forChild(departmentFunctionalityRoutes);