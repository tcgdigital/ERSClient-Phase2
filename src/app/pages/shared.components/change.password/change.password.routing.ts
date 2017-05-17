import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './change.password.component';

const changePasswordRoutes: Routes = [
    {
        path: '',
        component: ChangePasswordComponent
    }
];

export const ChangePasswordRouting: ModuleWithProviders
    = RouterModule.forChild(changePasswordRoutes);