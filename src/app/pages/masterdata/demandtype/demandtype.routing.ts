import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemandTypeComponent } from './demandtype.component';

const demandTypeRoutes: Routes = [
    {
        path: '',
        component: DemandTypeComponent,
    }
];

export const DemandTypeRouting: ModuleWithProviders
    = RouterModule.forChild(demandTypeRoutes);