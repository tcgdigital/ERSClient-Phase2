import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnquiryEntryComponent } from './call.centre.entry.component';


const callCentreRoutes: Routes = [
    {
        path: '',
        component: EnquiryEntryComponent
    }
];

export const CallCentreRouting: ModuleWithProviders
    = RouterModule.forChild(callCentreRoutes);