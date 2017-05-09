import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { EmergencyLocationService , EmergencyLocationListComponent } from './components';
import { DataExchangeService } from '../../../shared';
import { EmergencyLocationComponent } from './emergencylocation.component'
import { EmergencyLocationRouting } from './emergencylocation.routing'



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        MdCheckboxModule,
        EmergencyLocationRouting
    ],
    declarations: [
        EmergencyLocationComponent,
        EmergencyLocationListComponent
    ],
    providers: [
        EmergencyLocationService,
        DataExchangeService
    ]
})
export class EmergencyLocationModule { }