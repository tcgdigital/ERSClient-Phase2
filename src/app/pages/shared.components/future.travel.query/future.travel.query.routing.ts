import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FutureTravelQueryComponent } from './future.travel.query.components';
import { FutureTravelQueryAssignedCallsListComponent, FutureTravelQueryRecievedCallsListComponent } from "./components";


const futureTravelQueryRoutes: Routes = [

    {

        path: '',
        component: FutureTravelQueryComponent,
        children: [
            {
                path: '',
                redirectTo: 'receivedCalls',
                pathMatch: 'full'
            },
            {
                path: 'assignedcalls',
                component: FutureTravelQueryRecievedCallsListComponent
            },
            {
                path: 'receivedCalls',
                component: FutureTravelQueryAssignedCallsListComponent
            }]
    }];

export const FutureTravelQueryRouting: ModuleWithProviders
    = RouterModule.forChild(futureTravelQueryRoutes);