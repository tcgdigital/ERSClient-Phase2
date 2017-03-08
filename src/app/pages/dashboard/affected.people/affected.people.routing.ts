import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AffectedPeopleComponent } from './affected.people.component';
import { AffectedPeopleListComponent, AffectedPeopleVerificationComponent } from './components';


const affectedPeopleRoutes: Routes = [
    {
        path: '',
        component: AffectedPeopleComponent,
        children: [
            {
                path: 'detail',
                component: AffectedPeopleListComponent
            },
            {
                path: 'verify',
                component: AffectedPeopleVerificationComponent
            }
        ]
    },

];

export const AffectedPeopleRouting: ModuleWithProviders
    = RouterModule.forChild(affectedPeopleRoutes);