import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { AffectedService } from './components';
import { InvolvePartyService } from '../involveparties';
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
        AffectedService,
        InvolvePartyService,
        DataExchangeService
    ]
})
export class AffectedModule { }