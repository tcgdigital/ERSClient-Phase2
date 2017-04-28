import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArchiveDashboardListComponent } from './archive.dashboard.list.component';
import { AuthGuardService } from '../../shared/services';

const archiveDashboardRoutes: Routes = [
    {
        path: '',
        component: ArchiveDashboardListComponent,
        canActivate: [AuthGuardService],
    }
];

export const ArchiveDashboardRouting: ModuleWithProviders
    = RouterModule.forChild(archiveDashboardRoutes);