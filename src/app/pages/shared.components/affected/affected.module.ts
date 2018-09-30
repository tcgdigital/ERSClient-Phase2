import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { AffectedService } from './components';

import { DataExchangeService } from '../../../shared';
import { InvolvePartyService } from '../involveparties';


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
        AffectedService,
        InvolvePartyService,
        DataExchangeService
    ]
})
export class AffectedModule { }