import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuickLinkComponent } from './quicklink.component';

const quicklinkRoutes: Routes = [
    {
        path: '',
        component: QuickLinkComponent,
    }
];

export const QuickLinkRouting: ModuleWithProviders
    = RouterModule.forChild(quicklinkRoutes);