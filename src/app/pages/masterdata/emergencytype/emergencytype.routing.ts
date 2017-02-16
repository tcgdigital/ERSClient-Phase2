import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmergencyTypeComponent } from './emergencytype.component';

const emergencyTypeRoutes: Routes = [
    {
        path: '',
        component: EmergencyTypeComponent,
    }
];

export const EmergencyTypeRouting: ModuleWithProviders
    = RouterModule.forChild(emergencyTypeRoutes);