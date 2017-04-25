import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './shared';
import { AppComponent } from './app.component';

export const routes: Routes = [
    { path: '', redirectTo: 'pages', pathMatch: 'full' },
    { path: '**', redirectTo: 'pages/dashboard' },
];

// export const routing = RouterModule.forRoot(routes, { useHash: true });
export const routing = RouterModule.forRoot(routes, { useHash: false });