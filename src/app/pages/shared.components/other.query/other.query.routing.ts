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
                redirectTo: 'receivedCalls',
                pathMatch: 'full'
            }, {
                path: 'assignedcalls',
                component: OtherQueryRecievedCallsListComponent
            }, {
                path: 'receivedCalls',
                component: OtherQueryAssignedCallsListComponent
            }]
    }];

export const OtherQueryRouting: ModuleWithProviders
    = RouterModule.forChild(otherQueryRoutes);