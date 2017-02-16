import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login.component';

const loginRoutes: Routes = [
    {
        path: '',
        component: LoginComponent
    }
];

export const LoginRoutings: ModuleWithProviders
    = RouterModule.forChild(loginRoutes);