import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmergencyDepartmentComponent } from './emergency.department.component';

const emergencyDepartmentRoutes: Routes = [
    {
        path: '',
        component: EmergencyDepartmentComponent,
    }
];

export const EmergencyDepartmentypeRouting: ModuleWithProviders
    = RouterModule.forChild(emergencyDepartmentRoutes);