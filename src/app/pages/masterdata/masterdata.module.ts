import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { SharedModule } from '../../shared/shared.module';
import { MasterDateComponent } from './masterdata.component';
import { MasterDateRouting } from './masterdata.routing';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        MdCheckboxModule,
        MasterDateRouting
    ],
    declarations: [
        MasterDateComponent
    ]
})
export class MasterDateModule {
}