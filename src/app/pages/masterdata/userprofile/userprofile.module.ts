import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { BrowserModule } from '@angular/platform-browser';

import { UserProfileRouting } from './userprofile.routing';
import { UserProfileComponent } from './userprofile.component';
import {
    UserProfileEntryComponent, UserProfileListComponent,
    UserProfileService, UserAuthService
} from './components';

import { DataExchangeService, SharedModule } from '../../../shared';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        SharedModule,
        MdCheckboxModule,
        UserProfileRouting
    ],
    declarations: [
        UserProfileEntryComponent,
        UserProfileListComponent,
        UserProfileComponent
    ],
    providers: [
        UserProfileService,
        UserAuthService,
        DataExchangeService
    ]
})
export class UserProfileModule { }