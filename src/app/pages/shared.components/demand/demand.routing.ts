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
                path: 'assignedDemand',
                component: AssignedDemandComponent
            },
            {
                path: 'myDemands',
                component: MyDemandComponent,
            },
            {
                path: 'approvalDemands',
                component: ApprovedDemandComponent
            },
            {
                path: 'completedDemands',
                component: CompletedDemandComponent
            }
        ]
    }


];

export const DemandeRouting: ModuleWithProviders
    = RouterModule.forChild(demandRoutes);