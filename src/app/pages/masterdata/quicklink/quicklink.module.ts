import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QuickLinkRouting } from './quicklink.routing';
import { QuickLinkComponent } from './quicklink.component';
import { QuickLinkEntryComponent, QuickLinkListComponent, QuickLinkService } from './components';
import { DataExchangeService , SharedModule,FileUploadService, GlobalStateService } from '../../../shared';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { QuickLinkGroupModule } from '../quicklinkgroup';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        FormsModule,
        QuickLinkRouting,
        MdCheckboxModule,
        SharedModule,
        QuickLinkGroupModule
    ],
    declarations: [
        QuickLinkEntryComponent,
        QuickLinkListComponent,
        QuickLinkComponent
    ],
    providers: [
        QuickLinkService,
        DataExchangeService,
        FileUploadService,
        GlobalStateService
    ]
})
export class QuickLinkModule { }