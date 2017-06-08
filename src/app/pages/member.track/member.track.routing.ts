import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberTrackComponent } from './member.track.component';

const memberTrackRoutes: Routes = [
    {
        path: '',
        component: MemberTrackComponent,
    }
];

export const MemberTrackRouting: ModuleWithProviders
    = RouterModule.forChild(memberTrackRoutes);