import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { PagesRouting } from './pages.routing';

@NgModule({
    imports: [CommonModule, SharedModule, PagesRouting],
    declarations: [PagesComponent]
})
export class PagesModule {
}