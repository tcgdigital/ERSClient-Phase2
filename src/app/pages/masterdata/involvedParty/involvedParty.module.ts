import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { InvolvedPartyService } from './components';
import { DataExchangeService } from '../../../shared';


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
export class InvolvedPartyModule { }