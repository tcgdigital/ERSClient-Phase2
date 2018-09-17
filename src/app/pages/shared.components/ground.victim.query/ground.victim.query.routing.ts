import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroundVictimQueryComponent } from './ground.victim.query.component';
import {
    GroundVictimQueryAssignedCallsComponent,
    GroundVictimQueryReceivedCallsComponent
} from './components';

const groundVictimQueryComponent: Routes = [
    {
        path: '',
        component: GroundVictimQueryComponent,
        children: [
            {
                path: '',
                redirectTo: 'receivedCalls',
                pathMatch: 'full'
            }, {
                path: 'assignedCalls',
                component: GroundVictimQueryReceivedCallsComponent
            }, {
                path: 'receivedCalls',
                component: GroundVictimQueryAssignedCallsComponent 
            }]
    }];

export const GroundVictimQueryRouting: ModuleWithProviders
    = RouterModule.forChild(groundVictimQueryComponent);