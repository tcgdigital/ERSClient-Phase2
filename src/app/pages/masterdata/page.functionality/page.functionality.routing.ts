import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageFunctionalityComponent } from './page.functionality.component';

const pageFunctionalityRoutes: Routes = [
    {
        path: '',
        component: PageFunctionalityComponent,
    }
];

export const PageFunctionalityeRouting: ModuleWithProviders
    = RouterModule.forChild(pageFunctionalityRoutes);