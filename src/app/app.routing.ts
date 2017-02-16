import { Routes, RouterModule } from '@angular/router';
// import { AuthGuardService } from './services/auth.guard.service';
// import { LoginComponent } from '../pages/login/components/login.component';

import { AppComponent } from './app.component';

export const routes: Routes = [
    { path: '', redirectTo: 'pages', pathMatch: 'full' },
    { path: '**', redirectTo: 'pages/dashboard' },
    // { path: 'login', component: LoginComponent },
    // { path: '', redirectTo: 'pages/dashboard', canActivate: [AuthGuardService] , pathMatch: 'full'},

    // { path: '', redirectTo: 'pages/dashboard', pathMatch: 'full'},
    // { path: '**', redirectTo: '' }

    // { path: '', component: AppComponent }
];

// export const routing = RouterModule.forRoot(routes, { useHash: true });
export const routing = RouterModule.forRoot(routes, { useHash: false });