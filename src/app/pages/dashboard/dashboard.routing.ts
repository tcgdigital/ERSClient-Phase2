import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const dashboardRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            { path: 'people', loadChildren: '../shared.components/affected.people/affected.people.module#AffectedPeopleModule' },
            { path: 'cargo', loadChildren: '../shared.components/affected.objects/affected.objects.module#AffectedObjectsModule' },
            { path: 'callCentre', loadChildren: '../shared.components/call.centre/call.centre.module#CallCentreModule' },
            { path: 'actionable', loadChildren: '../shared.components/actionables/actionable.module#ActionableModule' },
            { path: 'broadcast', loadChildren: '../shared.components/broadcast/broadcast.module#BroadcastModule' },
            { path: 'presidentMessage', loadChildren: '../shared.components/presidentMessage/presidentMessage.module#PrecidentMessageModule' },
            { path: 'media', loadChildren: '../shared.components/media/media.module#MediaModule' }
        ]
    }
];

export const DashboardRouting: ModuleWithProviders
    = RouterModule.forChild(dashboardRoutes);