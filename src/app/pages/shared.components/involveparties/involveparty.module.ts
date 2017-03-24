import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { InvolvePartyService } from './components';
// import { IncidentService } from '../../incident';
import { SharedModule, DataExchangeService } from '../../../shared';

@NgModule({
    imports: [
        HttpModule,
        SharedModule
    ],
    providers: [
        InvolvePartyService,
        DataExchangeService
    ]
})
export class InvolvePartyModule { }