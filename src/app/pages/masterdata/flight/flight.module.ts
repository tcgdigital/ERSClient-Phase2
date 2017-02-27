import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { FlightService } from './components/flight.service';
import { BrowserModule } from '@angular/platform-browser';
import { DataExchangeService } from '../../../shared';
import { MdCheckboxModule } from '@angular2-material/checkbox';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        MdCheckboxModule
    ],
    declarations: [
    ],
    providers: [
        FlightService,
        DataExchangeService
    ]
})
export default class FlightModule { }