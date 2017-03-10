import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { PresidentMessageRouting } from './presidentMessage.routing';
import { PresidentMessageComponent } from './presidentMessage.component';
import { PresidentMessageEntryComponent, PresidentMessageListComponent, PresidentMessageService } from './components';
import { BrowserModule } from '@angular/platform-browser';
import { DataExchangeService } from '../../../shared';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        PresidentMessageRouting        
    ],
    declarations: [
        PresidentMessageEntryComponent,
        PresidentMessageListComponent,
        PresidentMessageComponent
    ],
    providers: [
        PresidentMessageService,
        DataExchangeService
    ]
})
export class PrecidentMessageModule { }