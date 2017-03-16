import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { EmergencyTypeRouting } from './emergencytype.routing';
import { EmergencyTypeComponent } from './emergencytype.component';
import { EmergencyTypeService, EmergencyTypeEntryComponent, EmergencyTypeDetailComponent } from './components';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        EmergencyTypeRouting
    ],
    declarations: [
        EmergencyTypeEntryComponent,
        EmergencyTypeDetailComponent,
        EmergencyTypeComponent
    ],
    providers: [
        EmergencyTypeService
    ]
})
export class EmergencyTypeModule { 
    
}