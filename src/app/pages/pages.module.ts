import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { PagesRouting } from './pages.routing';
import { MasterDateModule } from './masterdata';
import { DataExchangeService } from '../shared';
// import { IncidentModule } from './incident';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        PagesRouting,
        ReactiveFormsModule,
        FormsModule
        // IncidentModule.forRoot(),
        // SharedComponentModule.expose(),
        // MasterDateModule.expose()
    ],
    declarations: [PagesComponent],
     providers: [
         DataExchangeService
     ]
})
export class PagesModule {
}