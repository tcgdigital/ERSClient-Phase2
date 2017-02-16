import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { DemandTypeRouting } from './demandtype.routing';
import { DemandTypeComponent } from './demandtype.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        DemandTypeRouting
    ],
    declarations: [
        DemandTypeComponent
    ],
    providers: [
    ]
})
export class DemandTypeModule { }