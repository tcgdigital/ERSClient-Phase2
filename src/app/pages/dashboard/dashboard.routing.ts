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
            { path: 'passengerquery', loadChildren: '../shared.components/passanger.query/passanger.query.module#PassengerQueryModule' },
              { path: 'cargoquery', loadChildren: '../shared.components/cargo.query/cargo.query.module#CargoQueryModule' },
            { path: 'crewQuery', loadChildren: '../shared.components/crew.query/crew.query.module#CrewQueryModule' },


            { path: 'mediaquery', loadChildren: '../shared.components/media.query/media.query.module#MediaQueryModule' },
             { path: 'futuretravelquery', loadChildren: '../shared.components/future.travel.query/future.travel.query.module#FutureTravelQueryModule' },
              { path: 'generalupdatequery', loadChildren: '../shared.components/general.update.query/general.update.query.module#GeneralUpdateQueryModule' },
              { path: 'otherQuery', loadChildren: '../shared.components/other.query/other.query.module#OtherQueryModule' },
             { path: 'situationalupdatesquery', loadChildren: '../shared.components/situational.update.query/situational.update.query.module#SituationalUpdateQueryModule' },
             { path: 'customerdissatisfactionquery', loadChildren: '../shared.components/customer.dissatisfaction/customer.dissatisfaction.module#CustomerDissatisfactionModule' },
             { path: 'groundmembers', loadChildren: '../shared.components/ground.members/ground.victims.module#GroundVictimsModule' }
        ]
    }
];

export const DashboardRouting: ModuleWithProviders
    = RouterModule.forChild(dashboardRoutes);