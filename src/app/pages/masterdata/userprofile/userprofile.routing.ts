import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserProfileComponent } from './userprofile.component';

const userProfileRoutes: Routes = [
    {
        path: '',
        component: UserProfileComponent,
    }
];

export const UserProfileRouting: ModuleWithProviders
    = RouterModule.forChild(userProfileRoutes);