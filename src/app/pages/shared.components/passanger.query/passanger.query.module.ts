import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { PassangerQueryRouting } from './passanger.query.routing';
import { PassangerQueryComponent } from './passanger.query.components';
import { PassangerQueryAssignedCallsListComponent, PassangerQueryRecievedCallsListComponent } from "./components";
import { EnquiryService, EnquiryEntryComponent} from '../call.centre';
import { CallCenterOnlyPageService } from "../../callcenteronlypage/component";
import { DataExchangeService,SharedModule } from '../../../shared';
import { ModalModule} from 'ng2-bootstrap/modal';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        SharedModule,
        MdCheckboxModule,
        ModalModule,
        PassangerQueryRouting
    ],
    declarations: [
       PassangerQueryComponent,
       PassangerQueryRecievedCallsListComponent,
       EnquiryEntryComponent,
       PassangerQueryAssignedCallsListComponent
    ],
    providers: [
        EnquiryService,
        DataExchangeService,
        CallCenterOnlyPageService
    ]
})
export class PassengerQueryModule { }