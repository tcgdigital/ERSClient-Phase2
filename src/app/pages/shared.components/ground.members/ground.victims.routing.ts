import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroundVictimsComponent } from './ground.victims.components';

const groundVictimsComponent: Routes = [
    {
        path: '',
        component: GroundVictimsComponent,
    }];

export const GroundVictimsRouting: ModuleWithProviders
    = RouterModule.forChild(groundVictimsComponent);