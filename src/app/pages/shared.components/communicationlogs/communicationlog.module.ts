import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { CommunicationLogService } from "./components";
NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule
    ],
    declarations: [
    //   EnquiryEntryComponent
    ],
    exports:[
    //    EnquiryEntryComponent
    ],
    providers: [
       
        CommunicationLogService
    ]
})
export class CallCentreModule { }