import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { EmergencyLocationService, EmergencyLocationListComponent, EmergencyLocationEntryComponent } from './components';
import { DataExchangeService, SharedModule, FileUploadService } from '../../../shared';
import { EmergencyLocationComponent } from './emergencylocation.component';
import { EmergencyLocationRouting } from './emergencylocation.routing';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        MdCheckboxModule,
        SharedModule,
        EmergencyLocationRouting
    ],
    declarations: [
        EmergencyLocationComponent,
        EmergencyLocationListComponent,
        EmergencyLocationEntryComponent
    ],
    providers: [
        EmergencyLocationService,
        DataExchangeService,
        FileUploadService
    ]
})
export class EmergencyLocationModule { }