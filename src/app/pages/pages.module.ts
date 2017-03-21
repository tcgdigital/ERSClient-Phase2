import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { PagesRouting } from './pages.routing';
import { SharedComponentModule } from './shared.components';
import { MasterDateModule } from './masterdata';
// import { IncidentModule } from './incident';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        PagesRouting,
        // IncidentModule.forRoot(),
        // SharedComponentModule.expose(),
        // MasterDateModule.expose()
    ],
    declarations: [PagesComponent]
})
export class PagesModule {
}