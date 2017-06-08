import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassangerQueryComponent } from './passanger.query.components';
import { PassangerQueryAssignedCallsListComponent, PassangerQueryRecievedCallsListComponent } from "./components";


const passangerQueryComponent: Routes = [

    {

        path: '',
        component: PassangerQueryComponent,
        children: [
            {
                path: '',
                component: PassangerQueryAssignedCallsListComponent
            },
            {
                path: 'assignedcalls',
                component: PassangerQueryRecievedCallsListComponent
            },
            {
                path: 'recievedCalls',
                component: PassangerQueryAssignedCallsListComponent
            }]
    }];

export const PassangerQueryRouting: ModuleWithProviders
    = RouterModule.forChild(passangerQueryComponent);