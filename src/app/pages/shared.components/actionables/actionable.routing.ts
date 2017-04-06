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
                component: ActionableActiveComponent
            },
            {
                path: 'openActionable',
                component: ActionableActiveComponent
            },
            {
                path: 'closeActionable',
                component: ActionableClosedComponent,
            }
        ]
    }
];

export const ActionableRouting: ModuleWithProviders
    = RouterModule.forChild(actionaleRoutes);