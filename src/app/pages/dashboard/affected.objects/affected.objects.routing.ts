import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AffectedObjectsComponent } from './affected.objects.component';
import { AffectedObjectsListComponent, AffectedObjectsVerificationComponent } from './components';


const affectedObjectsRoutes: Routes = [
    {
        path: '',
        component: AffectedObjectsComponent,
        children: [
            {
                path: 'detail',
                component: AffectedObjectsListComponent
            },
            {
                path: 'verify',
                component: AffectedObjectsVerificationComponent
            }
        ]
    },

];

export const AffectedObjectsRouting: ModuleWithProviders
    = RouterModule.forChild(affectedObjectsRoutes);