import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { TemplateRouting } from './template.routing';
import { TemplateComponent } from './template.component';
import { TemplateListComponent, TemplateService, TemplateEntryComponent } from './components';
import { EmergencySituationService } from '../emergency.situation/components';
import { DataExchangeService,SharedModule, GlobalStateService, UtilityService } from '../../../shared';
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        FormsModule,
        TemplateRouting,
        MdCheckboxModule,
        CKEditorModule,
        SharedModule
    ],
    declarations: [
        TemplateListComponent,
        TemplateEntryComponent,
        TemplateComponent
    ],
    providers: [
        TemplateService,
        DataExchangeService,
        EmergencySituationService,
        UtilityService
    ]
})
export class TemplateModule { }