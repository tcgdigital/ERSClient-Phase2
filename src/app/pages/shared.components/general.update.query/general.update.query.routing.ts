import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneralUpdateQueryComponent } from './general.update.query.components';
import { GeneralUpdateQueryAssignedCallsListComponent, GeneralUpdateQueryRecievedCallsListComponent } from "./components";


const GeneralUpdateQueryRoutes: Routes = [
    
    {
       
        path: '',
        component: GeneralUpdateQueryComponent,
        children: [
            {
                path: '',
                component: GeneralUpdateQueryAssignedCallsListComponent
            },
             {
                 path: 'assignedcalls',
                component: GeneralUpdateQueryAssignedCallsListComponent
            },
             {
                path: 'recievedCalls',
                 component: GeneralUpdateQueryRecievedCallsListComponent
            }]
    }];

export const  GeneralUpdateQueryRouting: ModuleWithProviders
    = RouterModule.forChild(GeneralUpdateQueryRoutes);