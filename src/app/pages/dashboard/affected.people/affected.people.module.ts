import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { AffectedPeopleComponent } from './affected.people.component';
import { AffectedPeopleRouting } from './affected.people.routing';
import {
    AffectedPeopleListComponent,
    AffectedPeopleService,
    AffectedPeopleVerificationComponent
} from './components';
import { DataExchangeService } from '../../../shared';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        MdCheckboxModule,
        AffectedPeopleRouting
    ],
    declarations: [
        AffectedPeopleComponent,
        AffectedPeopleListComponent,
        AffectedPeopleVerificationComponent
    ],
    providers: [
        AffectedPeopleService,
        DataExchangeService
    ]
})
export class AffectedPeopleModule { }