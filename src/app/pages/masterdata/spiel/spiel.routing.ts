import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpileComponent } from './spiel.component';

const spileRoutes: Routes = [
    {
        path: '',
        component: SpileComponent,
    }
];

export const SpileRouting: ModuleWithProviders
    = RouterModule.forChild(spileRoutes);