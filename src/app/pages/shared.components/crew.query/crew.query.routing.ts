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
                component: CrewQueryAssignedCallsListComponent
            },
             {
                 path: 'assignedcalls',
                component: CrewQueryAssignedCallsListComponent
            },
             {
                path: 'recievedCalls',
                 component: CrewQueryRecievedCallsListComponent
            }]
    }];

export const  CrewQueryRouting: ModuleWithProviders
    = RouterModule.forChild(crewQueryComponent);