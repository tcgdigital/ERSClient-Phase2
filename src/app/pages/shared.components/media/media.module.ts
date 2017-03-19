import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MediaRouting } from './media.routing';
import { MediaComponent } from './media.component';
import {
    MediaReleaseComponent, MediaReleaseEntryComponent,
    MediaReleaseListComponent, MediaQueryListComponent, MediaService
} from './components';
import { BrowserModule } from '@angular/platform-browser';
import { DataExchangeService } from '../../../shared';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        MediaRouting
    ],
    declarations: [
        MediaComponent,
        MediaReleaseComponent,
        MediaReleaseEntryComponent,
        MediaReleaseListComponent,
        MediaQueryListComponent
    ],
    providers: [
        MediaService,
        DataExchangeService
    ]
})
export class MediaModule { }