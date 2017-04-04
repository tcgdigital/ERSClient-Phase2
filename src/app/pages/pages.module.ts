import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { PagesRouting } from './pages.routing';
import { MasterDateModule } from './masterdata';
import { IncidentModule } from './incident';
// import { IncidentModule } from './incident';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        IncidentModule,
        MasterDateModule,
        PagesRouting
    ],
    declarations: [PagesComponent]
})
export class PagesModule {
}