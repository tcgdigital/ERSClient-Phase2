import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { OrganizationService } from './components';
import { SharedModule, DataExchangeService } from '../../../shared';

@NgModule({
    imports: [
        HttpModule
    ],
    providers: [
        OrganizationService,
        DataExchangeService
    ]
})
export class OrganizationModule { }