import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AffectedPeopleComponent } from './affected.people.component';
import { AffectedPeopleListComponent, AffectedPeopleVerificationComponent } from './components';


const affectedPeopleRoutes: Routes = [
    {
        path: '',
        component: AffectedPeopleComponent
    },
     {
        path: 'affectedPeopleList',
        component: AffectedPeopleListComponent
    },
     {
        path: 'affectedPeopleToVerify',
        component: AffectedPeopleVerificationComponent
    }
];

export const AffectedPeopleRouting: ModuleWithProviders
    = RouterModule.forChild(affectedPeopleRoutes);