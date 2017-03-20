import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnquiryComponent } from './call.centre.component';


const callCentreRoutes: Routes = [
    {
        path: '',
        component: EnquiryComponent
    }
];

export const CallCentreRouting: ModuleWithProviders
    = RouterModule.forChild(callCentreRoutes);