import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './landing.component';

const landingRoutes: Routes = [
    {
        path: '',
        component: LandingComponent,
    }
];

export const LandingRouting: ModuleWithProviders
    = RouterModule.forChild(landingRoutes);