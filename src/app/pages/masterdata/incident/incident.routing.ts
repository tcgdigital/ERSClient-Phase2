import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncidentComponent } from './incident.component';

const incidentRoutes: Routes = [
    {
        path: '',
        component: IncidentComponent,
    }
];

export const IncidentRouting: ModuleWithProviders
    = RouterModule.forChild(incidentRoutes);