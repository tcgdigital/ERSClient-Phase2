import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotifyPeopleComponent } from './notifypeople.component';

const notifyPeopleRoutes: Routes = [
    {
        path: '',
        component: NotifyPeopleComponent,
    }
];

export const NotifyPeopleRouting: ModuleWithProviders
    = RouterModule.forChild(notifyPeopleRoutes);