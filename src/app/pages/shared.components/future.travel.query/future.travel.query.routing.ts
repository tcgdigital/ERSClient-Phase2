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
                component: FutureTravelQueryAssignedCallsListComponent
            },
            {
                path: 'assignedcalls',
                component: FutureTravelQueryRecievedCallsListComponent
            },
            {
                path: 'recievedCalls',
                component: FutureTravelQueryAssignedCallsListComponent
            }]
    }];

export const FutureTravelQueryRouting: ModuleWithProviders
    = RouterModule.forChild(futureTravelQueryRoutes);