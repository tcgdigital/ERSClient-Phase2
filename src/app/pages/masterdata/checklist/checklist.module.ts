import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ChecklistRouting } from './checklist.routing';
import { ChecklistComponent } from './checklist.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ChecklistRouting
    ],
    declarations: [
        ChecklistComponent
    ],
    providers: [
    ]
})
export class ChecklistModule { }