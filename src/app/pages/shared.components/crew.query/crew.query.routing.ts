import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrewQueryComponent } from './crew.query.component';


const crewQueryRoutes: Routes = [
    {
        path: '',
        component: CrewQueryComponent
    }
];

export const CrewQueryRouting: ModuleWithProviders
    = RouterModule.forChild(crewQueryRoutes);