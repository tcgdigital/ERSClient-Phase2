import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneralUpdateQueryComponent } from './general.update.query.components';
import {
    GeneralUpdateQueryAssignedCallsListComponent,
    GeneralUpdateQueryRecievedCallsListComponent
} from "./components";


const GeneralUpdateQueryRoutes: Routes = [
    {
        path: '',
        component: GeneralUpdateQueryComponent,
        children: [
            {
                path: '',
                redirectTo: 'receivedCalls',
                pathMatch: 'full'
            }, {
                path: 'assignedcalls',
                component: GeneralUpdateQueryRecievedCallsListComponent
            }, {
                path: 'receivedCalls',
                component: GeneralUpdateQueryAssignedCallsListComponent
            }]
    }];

export const GeneralUpdateQueryRouting: ModuleWithProviders
    = RouterModule.forChild(GeneralUpdateQueryRoutes);