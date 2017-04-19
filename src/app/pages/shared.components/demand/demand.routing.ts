import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemandComponent } from './demand.component';
import { ApprovedDemandComponent, AssignedDemandComponent, 
    CompletedDemandComponent, MyDemandComponent } from './components';

const demandRoutes: Routes = [
    {
        path: '',
        component: DemandComponent,
        children: [
            {
                path: '',
                // component: AssignedDemandComponent
                redirectTo: 'assigned', 
                pathMatch: 'full'
            },
            {
                path: 'assigned',
                component: AssignedDemandComponent
            },
            {
                path: 'own',
                component: MyDemandComponent,
            },
            {
                path: 'approval',
                component: ApprovedDemandComponent
            },
            {
                path: 'completed',
                component: CompletedDemandComponent
            }
        ]
    }
];

export const DemandeRouting: ModuleWithProviders
    = RouterModule.forChild(demandRoutes);