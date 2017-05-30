import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargoQueryComponent } from './cargo.query.components';
import { CargoQueryAssignedCallsListComponent, CargoQueryRecievedCallsListComponent } from "./components";


const cargoQueryComponent: Routes = [
    
    {
       
        path: '',
        component: CargoQueryComponent,
        children: [
            {
                path: '',
                component: CargoQueryAssignedCallsListComponent
            },
             {
                 path: 'assignedcalls',
                component: CargoQueryAssignedCallsListComponent
            },
             {
                path: 'recievedCalls',
                 component: CargoQueryRecievedCallsListComponent
            }]
    }];

export const  CargoQueryRouting: ModuleWithProviders
    = RouterModule.forChild(cargoQueryComponent);