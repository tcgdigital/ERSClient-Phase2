import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { ForgotPasswordComponent } from './components/forgot.password.component';
import { LoginRootComponent } from './login.root.component';
import { ChangePasswordComponent } from './components/change.password.component';

const loginRoutes: Routes = [
    {
        path: '',
        component: LoginRootComponent,
        children: [
            { path: '', component: LoginComponent },
            { path: 'forgot', component: ForgotPasswordComponent },
            { path: 'change', component: ChangePasswordComponent }
        ]
    }
];

export const LoginRoutings: ModuleWithProviders
    = RouterModule.forChild(loginRoutes);