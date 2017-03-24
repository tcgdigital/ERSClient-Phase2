import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { CrewQueryComponent } from './crew.query.component';
import { CrewQueryRouting } from './crew.query.routing';
import { EnquiryService} from '../call.centre';
import { DataExchangeService,SharedModule } from '../../../shared';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        SharedModule,
        MdCheckboxModule,
        CrewQueryRouting
    ],
    declarations: [
       CrewQueryComponent
    ],
    providers: [
        EnquiryService,
        DataExchangeService
    ]
})
export class CrewQueryModule { }