import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { EmergencyTypeRouting } from './emergencytype.routing';
import { EmergencyTypeComponent } from './emergencytype.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        EmergencyTypeRouting
    ],
    declarations: [
        EmergencyTypeComponent
    ],
    providers: [
    ]
})
export class EmergencyTypeModule { }