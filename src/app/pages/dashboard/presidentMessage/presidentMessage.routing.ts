import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PresidentMessageComponent } from './presidentMessage.component';

const presidentMessageRoutes: Routes = [
    {
        path: '',
        component: PresidentMessageComponent,
    }
];

export const PresidentMessageRouting: ModuleWithProviders
    = RouterModule.forChild(presidentMessageRoutes);