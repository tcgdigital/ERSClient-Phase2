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
            { path: 'media', loadChildren: '../shared.components/media/media.module#MediaModule' },
            { path: 'demand', loadChildren: '../shared.components/demand/demand.module#DemandModule' },
            { path: 'otherQuery', loadChildren: '../shared.components/other.query/other.query.module#OtherQueryModule' },
            { path: 'crewQuery', loadChildren: '../shared.components/crew.query/crew.query.module#CrewQueryModule' }
        ]
    }
];

export const DashboardRouting: ModuleWithProviders
    = RouterModule.forChild(dashboardRoutes);