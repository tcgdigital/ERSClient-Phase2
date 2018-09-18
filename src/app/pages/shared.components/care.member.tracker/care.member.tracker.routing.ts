import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CareMemberTrackerComponent } from './components';


const careMemberTrackerRouts: Routes = [
    {
        path: '',
        component: CareMemberTrackerComponent
    }
];

export const CareMemberTrackerRouting: ModuleWithProviders
    = RouterModule.forChild(careMemberTrackerRouts);