import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { FlightService } from './components';
import { DataExchangeService } from '../../../shared';

@NgModule({
    imports: [
        CommonModule,
        HttpModule
    ],
    providers: [
        FlightService,
        DataExchangeService
    ]
})
export class FlightModule { }