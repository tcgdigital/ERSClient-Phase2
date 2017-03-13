import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BroadcastDepartmentComponent } from './boradcast.department.component';

const broadcastDepartmentRoutes: Routes = [
    {
        path: '',
        component: BroadcastDepartmentComponent,
    }
];

export const  BroadcastDepartmentRouting: ModuleWithProviders
    = RouterModule.forChild(broadcastDepartmentRoutes);