import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MediaComponent } from './media.component';
import { MediaReleaseComponent, MediaQueryListComponent } from './components';

const mediaRoutes: Routes = [
    {
        path: '',
        component: MediaComponent,
        children:[
             {
                path: '',
                component: MediaQueryListComponent
            },
            {
                path: 'release',
                component: MediaReleaseComponent
            },
            {
                path: 'query',
                component: MediaQueryListComponent
            }
        ]
    }
];

export const MediaRouting: ModuleWithProviders
    = RouterModule.forChild(mediaRoutes);