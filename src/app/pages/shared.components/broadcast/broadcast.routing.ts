import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BroadcastComponent } from './broadcast.component';

const broadcastRoutes: Routes = [
    {
        path: '',
        component: BroadcastComponent,
    }
];

export const  BroadcastRouting: ModuleWithProviders
    = RouterModule.forChild(broadcastRoutes);