import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LicensingComponent } from './licensing.component';
import { LicensingRouting } from './licensing.routing';
import { SharedModule } from '../../shared';
import {
    LicensingApplyKeyComponent,
    LicensingInvalidKeyComponent, LicensingService
} from './components';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        SharedModule,
        LicensingRouting
    ],
    declarations: [
        LicensingApplyKeyComponent,
        LicensingInvalidKeyComponent,
        LicensingComponent
    ],
    providers: [

    ]
})
export class LicensingModule { }