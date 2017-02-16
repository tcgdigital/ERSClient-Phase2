import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { DashboardRouting } from './dashboard.routing';
import { DashboardComponent } from './dashboard.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        DashboardRouting
    ],
    declarations: [
        DashboardComponent
    ]
})
export class DashboardModule { }