import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { ModalModule } from 'ngx-bootstrap';

import { GroundVictimQueryComponent } from './ground.victim.query.component';
import {
    GroundVictimQueryAssignedCallsComponent,
    GroundVictimQueryReceivedCallsComponent
} from './components';
import { EnquiryService, CallCentreModule } from '../call.centre';
import { DataExchangeService, SharedModule } from '../../../shared';
import { CallCenterOnlyPageService } from '../../callcenteronlypage';
import { CommunicationLogService } from '../communicationlogs';
import { GroundVictimQueryRouting } from './ground.victim.query.routing';

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
        GroundVictimQueryRouting
    ],
    exports: [],
    declarations: [
        GroundVictimQueryAssignedCallsComponent,
        GroundVictimQueryReceivedCallsComponent,
        GroundVictimQueryComponent
    ],
    providers: [
        EnquiryService,
        DataExchangeService,
        CallCenterOnlyPageService,
        CommunicationLogService
    ],
})
export class GroundVictimQueryModule { }
