import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtherQueryComponent } from './other.query.components';
import { OtherQueryAssignedCallsListComponent, OtherQueryRecievedCallsListComponent } from "./components";


const otherQueryRoutes: Routes = [
    
    {
       
        path: '',
        component: OtherQueryComponent,
        children: [
            {
                path: '',
                component: OtherQueryAssignedCallsListComponent
            },
             {
                 path: 'assignedcalls',
                component: OtherQueryAssignedCallsListComponent
            },
             {
                path: 'recievedCalls',
                 component: OtherQueryRecievedCallsListComponent
            }]
    }];

export const  OtherQueryRouting: ModuleWithProviders
    = RouterModule.forChild(otherQueryRoutes);