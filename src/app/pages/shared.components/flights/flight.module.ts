import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { FlightService } from './components';
import { SharedModule, DataExchangeService } from '../../../shared';

@NgModule({
    imports: [
        HttpModule
    ],
    providers: [
        FlightService,
        DataExchangeService
    ]
})
export class FlightModule { }