import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroundVictimsComponent } from './ground.victims.components';
//import { CrewQueryAssignedCallsListComponent, CrewQueryRecievedCallsListComponent } from "./components";


const groundVictimsComponent: Routes = [

    {

        path: '',
        component: GroundVictimsComponent,
        children: [
           ]
    }];

export const GroundVictimsRouting: ModuleWithProviders
    = RouterModule.forChild(groundVictimsComponent);