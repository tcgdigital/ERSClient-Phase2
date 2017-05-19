import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmergencyLocationComponent } from './emergencylocation.component';

const emergencylocationRoutes: Routes = [
    {
        path: '',
        component: EmergencyLocationComponent,
    }
];

export const EmergencyLocationRouting: ModuleWithProviders
    = RouterModule.forChild(emergencylocationRoutes);