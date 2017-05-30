import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AircraftTypeService } from './components';
import { SharedModule, DataExchangeService } from '../../../shared';

@NgModule({
    imports: [
        HttpModule
    ],
    providers: [
        AircraftTypeService,
        DataExchangeService
    ]
})
export class AircraftTypeModule { }