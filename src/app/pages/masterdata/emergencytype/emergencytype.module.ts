import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { EmergencyTypeRouting } from './emergencytype.routing';
import { EmergencyTypeComponent } from './emergencytype.component';
import { EmergencyTypeService, EmergencyTypeEntryComponent, EmergencyTypeDetailComponent } from './components';
import { DataExchangeService , SharedModule} from '../../../shared';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        EmergencyTypeRouting,
        SharedModule,
        MdCheckboxModule
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