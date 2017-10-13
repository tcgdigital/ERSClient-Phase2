import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SpileRouting } from './spiel.routing';
import { SpileComponent } from './spiel.component';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        FormsModule,
        SpileRouting
    ],
    declarations: [
        SpileComponent
    ],
    providers: [
        
        
    ]
})
export class SpielModule { }