import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SituationalUpdateQueryComponent } from './situational.update.query.components';
import { SituationalUpdateQueryAssignedCallsListComponent, SituationalUpdateQueryRecievedCallsListComponent } from "./components";


const situationalUpdateQueryRoutes: Routes = [

    {

        path: '',
        component: SituationalUpdateQueryComponent,
        children: [
            {
                path: '',
                redirectTo: 'receivedCalls',
                pathMatch: 'full'
            },
            {
                path: 'assignedcalls',
                component: SituationalUpdateQueryRecievedCallsListComponent
            },
            {
                path: 'receivedCalls',
                component: SituationalUpdateQueryAssignedCallsListComponent
            }]
    }];

export const SituationalUpdateQueryRouting: ModuleWithProviders
    = RouterModule.forChild(situationalUpdateQueryRoutes);