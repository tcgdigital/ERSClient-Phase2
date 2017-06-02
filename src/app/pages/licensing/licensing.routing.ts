import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LicensingComponent } from './licensing.component';
import { LicensingInvalidKeyComponent, LicensingApplyKeyComponent } from './components'

const licensingRoutes: Routes = [
    {
        path: '',
        component: LicensingComponent,
        children: [
            { path: 'invalidkey/:id', component: LicensingInvalidKeyComponent },
            { path: 'applykey', component: LicensingApplyKeyComponent }
        ]
    }
];

export const LicensingRouting: ModuleWithProviders
    = RouterModule.forChild(licensingRoutes);