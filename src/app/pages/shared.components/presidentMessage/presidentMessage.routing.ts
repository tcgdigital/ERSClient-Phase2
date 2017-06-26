import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PresidentMessageComponent } from './presidentMessage.component';
import { PresidentMessageReleaseComponent, PresidentMessageApprovalComponent } from './components'

const presidentMessageRoutes: Routes = [
    {
        path: '',
        component: PresidentMessageComponent,
        children:[
             {
                path: '',
                // component: MediaQueryListComponent
                redirectTo: 'release', 
                pathMatch: 'full'
            },            
            {
                path: 'release',
                component: PresidentMessageReleaseComponent
            },
            {
                path: 'approvalpending',
                component: PresidentMessageApprovalComponent
            }
        ]
    }
];

export const PresidentMessageRouting: ModuleWithProviders
    = RouterModule.forChild(presidentMessageRoutes);