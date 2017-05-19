import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuardService } from '../../shared/services';

const dashboardRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        canActivateChild: [AuthGuardService],
        children: [
            { path: 'people', loadChildren: '../shared.components/affected.people/affected.people.module#AffectedPeopleModule' },
            { path: 'cargo', loadChildren: '../shared.components/affected.objects/affected.objects.module#AffectedObjectsModule' },
           // { path: 'callCentre', loadChildren: '../shared.components/call.centre/call.centre.module#CallCentreModule' },
            { path: 'actionable', loadChildren: '../shared.components/actionables/actionable.module#ActionableModule' },
            { path: 'broadcast', loadChildren: '../shared.components/broadcast/broadcast.module#BroadcastModule' },
            { path: 'presidentMessage', loadChildren: '../shared.components/presidentMessage/presidentMessage.module#PrecidentMessageModule' },
            { path: 'media', loadChildren: '../shared.components/media/media.module#MediaModule' },
            { path: 'demand', loadChildren: '../shared.components/demand/demand.module#DemandModule' },
           // { path: 'otherQuery', loadChildren: '../shared.components/other.query/other.query.module#OtherQueryModule' },
           // { path: 'crewQuery', loadChildren: '../shared.components/crew.query/crew.query.module#CrewQueryModule' }
           { path: 'passengerquery', loadChildren: '../shared.components/passanger.query/passanger.query.module#PassengerQueryModule' },
        //   { path: 'cargoquery', loadChildren: '../shared.components/cargo.query/demand.module#DemandModule' },
        //   { path: 'crewquery', loadChildren: '../shared.components/crew.query/demand.module#DemandModule' },
           //{ path: 'mediaquery', loadChildren: '../shared.components/demand/demand.module#DemandModule' },
         //  { path: 'futuretravelquery', loadChildren: '../shared.components/future.travel.query/demand.module#DemandModule' },
        //   { path: 'generalupdatequery', loadChildren: '../shared.components/general.update.query/demand.module#DemandModule' },
         //  { path: 'otherquery', loadChildren: '../shared.components/other.query/demand.module#DemandModule' },
         //  { path: 'situationalupdatesquery', loadChildren: '../shared.components/situational.update.query/demand.module#DemandModule' },
         //
         //  { path: 'customerdissatisfactionquery', loadChildren: '../shared.components/customer.dissatisfaction/demand.module#DemandModule' }
        ]
    }
];

export const DashboardRouting: ModuleWithProviders
    = RouterModule.forChild(dashboardRoutes);