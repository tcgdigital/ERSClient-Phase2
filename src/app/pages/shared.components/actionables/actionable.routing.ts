import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActionableComponent } from './actionable.component';
import { ActionableActiveComponent, ActionableClosedComponent } from './components';

const actionaleRoutes: Routes = [
    {
        path: '',
        component: ActionableComponent,
        children: [
            {
                path: '',
                redirectTo: 'open',
                pathMatch: 'full'
            },
            {
                path: 'open',
                component: ActionableActiveComponent
            },
            {
                path: 'close',
                component: ActionableClosedComponent,
            }
        ]
    }
];

export const ActionableRouting: ModuleWithProviders
    = RouterModule.forChild(actionaleRoutes);