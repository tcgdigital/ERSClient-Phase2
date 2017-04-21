import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../shared/shared.module';

import { EmergencyClosureRouting } from './emergency.closure.routing';
import { EmergencyClosureComponent } from './emergency.closure.component';
import { WidgetModule } from '../widgets';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        SharedModule,
        EmergencyClosureRouting
    ],
    declarations: [
        EmergencyClosureComponent
    ]
})
export class EmergencyClosureModule { }