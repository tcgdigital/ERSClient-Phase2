import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CallCenterOnlyPageComponent } from './callcenteronlypage.component';

const callcenterRoutes: Routes = [
    {
        path: '',
        component: CallCenterOnlyPageComponent,
    }
];

export const CallCenterPageRouting: ModuleWithProviders
    = RouterModule.forChild(callcenterRoutes);