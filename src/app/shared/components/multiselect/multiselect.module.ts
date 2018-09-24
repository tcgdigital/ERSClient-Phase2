import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MultiSelectComponent, ItemComponent, TemplateRendererComponent, BadgeComponent, SearchComponent } from './components';
import { ClickOutsideDirective, ScrollDirective, StyleDirective, SetPositionDirective } from './directives';
import { ListFilterPipe } from './pipes';

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [
        MultiSelectComponent,
        ClickOutsideDirective,
        ScrollDirective,
        StyleDirective,
        SetPositionDirective,
        ListFilterPipe,
        ItemComponent,
        TemplateRendererComponent,
        BadgeComponent,
        SearchComponent
    ],
    exports: [
        MultiSelectComponent,
        ClickOutsideDirective,
        ScrollDirective,
        StyleDirective,
        SetPositionDirective,
        ListFilterPipe,
        ItemComponent,
        TemplateRendererComponent,
        BadgeComponent,
        SearchComponent
    ]
})
export class MultiselectModule { }
