import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { EnquiryEntryComponent } from './call.centre.entry.component';
import { CallCentreRouting } from './call.centre.routing';
import { EnquiryService } from './components';
import { AffectedPeopleService } from '../affected.people';
import { AffectedObjectsService } from '../affected.objects';
import { DepartmentService } from '../../masterdata/department';
import { DemandService } from '../demand';
import { DataExchangeService, SharedModule, KeyValueService } from '../../../shared';
import { InvolvePartyService } from '../involveparties';
import { CommunicationLogService } from '../communicationlogs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PassengerService, CoPassengerService } from '../passenger';
import { GroundVictimService } from '../ground.victim';
import { AffectedService } from '../affected';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        SharedModule,
        MdCheckboxModule,
        ModalModule
    ],
    declarations: [
        EnquiryEntryComponent
    ],
    exports: [
        EnquiryEntryComponent
    ],
    providers: [
        EnquiryService,
        AffectedPeopleService,
        AffectedObjectsService,
        DepartmentService,
        DemandService,
        InvolvePartyService,
        CommunicationLogService,
        PassengerService,
        CoPassengerService,
        GroundVictimService,
        KeyValueService,
        AffectedService
    ]
})
export class CallCentreModule { }