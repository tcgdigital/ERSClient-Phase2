import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { EnquiryComponent } from './call.centre.component';
import { CallCentreRouting } from './call.centre.routing';
import { EnquiryService} from './components';
import { AffectedPeopleService } from '../affected.people';
import { AffectedObjectsService } from '../affected.objects';
import { DataExchangeService,SharedModule } from '../../../shared';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        SharedModule,
        MdCheckboxModule,
        CallCentreRouting
    ],
    declarations: [
       EnquiryComponent
    ],
    providers: [
        EnquiryService,
        DataExchangeService,
        AffectedPeopleService,
        AffectedObjectsService
    ]
})
export class CallCentreModule { }