import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MediaRouting } from './media.routing';
import { MediaComponent } from './media.component';
import {
    MediaReleaseComponent, MediaReleaseEntryComponent,
    MediaReleaseListComponent, MediaQueryListComponent, MediaService,
    MediaReleaseApprovalComponent,MediaReleaseApprovalListComponent, MediaReleaseApprovalEntryComponent
} from './components';
import { BrowserModule } from '@angular/platform-browser';
import { EnquiryService } from '../../shared.components';
import { DataExchangeService , SharedModule } from '../../../shared';
import { TemplateMediaService } from '../template.media/components';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        MediaRouting,
        SharedModule
    ],
    declarations: [
        MediaComponent,
        MediaReleaseComponent,
        MediaReleaseEntryComponent,
        MediaReleaseListComponent,
        MediaQueryListComponent,
        MediaReleaseApprovalComponent,
        MediaReleaseApprovalListComponent,
        MediaReleaseApprovalEntryComponent
    ],
    providers: [
        MediaService,
        DataExchangeService,
        EnquiryService,
        TemplateMediaService
    ]
})
export class MediaModule { }