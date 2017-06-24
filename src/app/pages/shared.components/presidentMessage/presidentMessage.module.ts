import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CKEditorModule } from 'ng2-ckeditor';

import { PresidentMessageRouting } from './presidentMessage.routing';
import { PresidentMessageComponent } from './presidentMessage.component';
import 
{ 
    PresidentMessageEntryComponent, 
    PresidentMessageListComponent, 
    PresidentMessageService,
    PresidentMessageApprovalComponent,
    PresidentMessageReleaseComponent,
    PresidentMessageApprovalListComponent,
    PresidentMessageApprovalEntryComponent
} from './components';
import { BrowserModule } from '@angular/platform-browser';
import { DataExchangeService , SharedModule } from '../../../shared';

import { TemplateMediaService } from '../template.media/components';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        CKEditorModule,
        ReactiveFormsModule,
        PresidentMessageRouting,       
        SharedModule
    ],
    declarations: [
        PresidentMessageEntryComponent,
        PresidentMessageListComponent,
        PresidentMessageComponent,
        PresidentMessageApprovalComponent,
        PresidentMessageReleaseComponent,
        PresidentMessageApprovalListComponent,
        PresidentMessageApprovalEntryComponent
    ],
    providers: [
        PresidentMessageService,
        DataExchangeService,
        TemplateMediaService
    ]
})
export class PrecidentMessageModule { }