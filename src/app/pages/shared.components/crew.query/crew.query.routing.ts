import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrewQueryComponent } from './crew.query.components';
import { CrewQueryAssignedCallsListComponent, CrewQueryRecievedCallsListComponent } from "./components";


const crewQueryComponent: Routes = [

    {

        path: '',
        component: CrewQueryComponent,
        children: [
            {
                path: '',
                redirectTo: 'receivedCalls',
                pathMatch: 'full'
            },
            {
                path: 'assignedcalls',
                component: CrewQueryRecievedCallsListComponent
            },
            {
                path: 'receivedCalls',
                component: CrewQueryAssignedCallsListComponent
            }]
    }];

export const CrewQueryRouting: ModuleWithProviders
    = RouterModule.forChild(crewQueryComponent);