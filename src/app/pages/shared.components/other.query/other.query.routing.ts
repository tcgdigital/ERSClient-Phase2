import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtherQueryComponent } from './other.query.component';


const otherQueryRoutes: Routes = [
    {
        path: '',
        component: OtherQueryComponent
    }
];

export const OtherQueryRouting: ModuleWithProviders
    = RouterModule.forChild(otherQueryRoutes);