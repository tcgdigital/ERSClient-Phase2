import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const dashboardRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            { path: 'people', loadChildren: './affected.people/affected.people.module#AffectedPeopleModule' },
            { path: 'cargo', loadChildren: './affected.objects/affected.objects.module#AffectedObjectsModule' },
            { path: 'callCentre', loadChildren: './call.centre/call.centre.module#CallCentreModule' },
            { path: 'actionable', loadChildren: './actionable/actionable.module#ActionableModule' }           
        ]
    }
];

export const DashboardRouting: ModuleWithProviders
    = RouterModule.forChild(dashboardRoutes);