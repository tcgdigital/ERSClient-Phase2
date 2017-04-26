import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmergencyClosureComponent } from './emergency.closure.component';

const emergencyclosureRoutes: Routes = [
    {
        path: '',
        component: EmergencyClosureComponent,
    }
];

export const EmergencyClosureRouting: ModuleWithProviders
    = RouterModule.forChild(emergencyclosureRoutes);