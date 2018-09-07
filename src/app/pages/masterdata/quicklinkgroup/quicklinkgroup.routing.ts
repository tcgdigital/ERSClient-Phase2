import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuickLinkGroupComponent } from './quicklinkgroup.component';


const quicklinkGroupRoutes: Routes = [
    {
        path: '',
        component: QuickLinkGroupComponent,
    }
];

export const QuickLinkGroupRouting: ModuleWithProviders
    = RouterModule.forChild(quicklinkGroupRoutes);