import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { CommunicationLogService } from '../../shared.components/communicationlogs';
import { DepartmentService } from '../../masterdata/department';
import { AffectedPeopleComponent } from './affected.people.component';
import { AffectedPeopleRouting } from './affected.people.routing';
import {
    AffectedPeopleListComponent,
    AffectedPeopleService,
    AffectedPeopleVerificationComponent
} from './components';
import { InvolvePartyService } from '../involveparties';
import { CallerService } from '../caller';
import { PassengerService } from '../passenger';
import { SharedModule, DataExchangeService } from '../../../shared';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CareMemberTrackerModule } from '../care.member.tracker';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        MdCheckboxModule,
        SharedModule,
        ModalModule,
        CareMemberTrackerModule,
        AffectedPeopleRouting
    ],
    declarations: [
        AffectedPeopleComponent,
        AffectedPeopleListComponent,
        AffectedPeopleVerificationComponent
    ],
    providers: [
        AffectedPeopleService,
        DataExchangeService,
        InvolvePartyService,
        CallerService,
        PassengerService,
        DepartmentService,
        CommunicationLogService
    ]
})
export class AffectedPeopleModule { }