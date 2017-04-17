import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QuickLinkRouting } from './quicklink.routing';
import { QuickLinkComponent } from './quicklink.component';
import { QuickLinkEntryComponent, QuickLinkListComponent, QuickLinkService } from './components';
import { DataExchangeService , SharedModule } from '../../../shared';
import { MdCheckboxModule } from '@angular2-material/checkbox';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        FormsModule,
        QuickLinkRouting,
        MdCheckboxModule,
        SharedModule
    ],
    declarations: [
        QuickLinkEntryComponent,
        QuickLinkListComponent,
        QuickLinkComponent
    ],
    providers: [
        QuickLinkService,
        DataExchangeService
    ]
})
export class QuickLinkModule { }