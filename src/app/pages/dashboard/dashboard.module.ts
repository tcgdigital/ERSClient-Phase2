import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../shared/shared.module';

import { DashboardRouting } from './dashboard.routing';
import { DashboardComponent } from './dashboard.component';
import { WidgetModule } from '../widgets';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        SharedModule,
        WidgetModule,
        DashboardRouting
    ],
    declarations: [
        DashboardComponent
    ]
})
export class DashboardModule { }