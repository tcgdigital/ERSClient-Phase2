import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AffectedObjectsComponent } from './affected.objects.component';
import { AffectedObjectsListComponent, AffectedObjectsVerificationComponent } from './components';


const affectedObjectsRoutes: Routes = [
    {
        path: '',
        component: AffectedObjectsComponent
    },
     {
        path: 'affectedObjects',
        component: AffectedObjectsListComponent
    },
     {
        path: 'affectedObjectsVerify',
        component: AffectedObjectsVerificationComponent
    }
];

export const AffectedObjectsRouting: ModuleWithProviders
    = RouterModule.forChild(affectedObjectsRoutes);