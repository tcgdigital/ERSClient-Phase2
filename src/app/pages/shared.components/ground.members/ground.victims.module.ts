import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { GroundVictimsRouting } from './ground.victims.routing';
import { GroundVictimsComponent } from './ground.victims.components';
//import { CrewQueryAssignedCallsListComponent, CrewQueryRecievedCallsListComponent } from './components';
import { EnquiryService, CallCentreModule } from '../call.centre';
import { CommunicationLogService } from '../communicationlogs';

import { CallCenterOnlyPageService } from '../../callcenteronlypage/component';
import { DataExchangeService, SharedModule } from '../../../shared';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        SharedModule,
        MdCheckboxModule,
        ModalModule,
        CallCentreModule,
        GroundVictimsRouting
    ],
    declarations: [
        GroundVictimsComponent
    ],
    providers: [
        EnquiryService,
        DataExchangeService,
        CallCenterOnlyPageService,
        CommunicationLogService
    ]
})
export class GroundVictimsModule { }