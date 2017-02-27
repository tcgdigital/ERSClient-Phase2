import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { InvolvedPartyService } from './components/involvedParty.service';
import { BrowserModule } from '@angular/platform-browser';
import { DataExchangeService } from '../../../shared/services/data.exchange/data.exchange.service';
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
        InvolvedPartyService,
        DataExchangeService
    ]
})
export default class InvolvedPartyModule { }