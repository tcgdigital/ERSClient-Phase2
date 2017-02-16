import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChecklistComponent } from './checklist.component';

const checklistRoutes: Routes = [
    {
        path: '',
        component: ChecklistComponent,
    }
];

export const ChecklistRouting: ModuleWithProviders
    = RouterModule.forChild(checklistRoutes);