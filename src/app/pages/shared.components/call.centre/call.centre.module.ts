import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { EnquiryEntryComponent } from './call.centre.entry.component';
import { CallCentreRouting } from './call.centre.routing';
import { EnquiryService} from './components';
import { AffectedPeopleService } from '../affected.people';
import { AffectedObjectsService } from '../affected.objects';
import { DepartmentService } from '../../masterdata/department';
import { DemandService } from '../demand';
import { DataExchangeService,SharedModule } from '../../../shared';
import { InvolvePartyService } from '../involveparties';

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
    //   EnquiryEntryComponent
    ],
    exports:[
    //    EnquiryEntryComponent
    ],
    providers: [
        EnquiryService,
        DataExchangeService,
        AffectedPeopleService,
        AffectedObjectsService,
        DepartmentService,
        DemandService,
        InvolvePartyService
    ]
})
export class CallCentreModule { }