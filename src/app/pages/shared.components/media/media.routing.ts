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
                // component: MediaQueryListComponent
                redirectTo: 'query', 
                pathMatch: 'full'
            },
            {
                path: 'query',
                component: MediaQueryListComponent
            },
            {
                path: 'release',
                component: MediaReleaseComponent
            }
        ]
    }
];

export const MediaRouting: ModuleWithProviders
    = RouterModule.forChild(mediaRoutes);