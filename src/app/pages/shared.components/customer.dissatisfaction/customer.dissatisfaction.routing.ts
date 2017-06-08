import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerDissatisfactionComponent } from './customer.dissatisfaction.components';
import { CustomerDissatisfactionAssignedCallsListComponent, CustomerDissatisfactionRecievedCallsListComponent } from "./components";


const customerDissatisfactionRoutes: Routes = [

    {

        path: '',
        component: CustomerDissatisfactionComponent,
        children: [
            {
                path: '',
                component: CustomerDissatisfactionAssignedCallsListComponent
            },
            {
                path: 'assignedcalls',
                component: CustomerDissatisfactionRecievedCallsListComponent
            },
            {
                path: 'receivedCalls',
                component: CustomerDissatisfactionAssignedCallsListComponent
            }]
    }];

export const CustomerDissatisfactionRoutesRouting: ModuleWithProviders
    = RouterModule.forChild(customerDissatisfactionRoutes);