import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { DepartmentAccessOwnerService } from './components';
import { SharedModule, DataExchangeService } from '../../../shared';

@NgModule({
    imports: [
        HttpModule
    ],
    providers: [
        DepartmentAccessOwnerService,
        DataExchangeService
    ]
})
export class DepartmentAccessOwnerModule { }