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
            { path: 'actionable', loadChildren: './actionable/actionable.module#ActionableModule' },
            { path: 'broadcast', loadChildren: './broadcast/broadcast.module#BroadcastModule' },
            { path: 'presidentMessage', loadChildren: './presidentMessage/presidentMessage.module#PrecidentMessageModule' },
            { path: 'media', loadChildren: './media/media.module#MediaModule' }
        ]
    }
];

export const DashboardRouting: ModuleWithProviders
    = RouterModule.forChild(dashboardRoutes);