import { NgModule, ModuleWithProviders} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import {
    BroadcastWidgetComponent,
    CasualtySummaryWidgetComponent,
    ChecklistSummaryWidgetComponent,
    ClockWidgetComponent,
    DemandSummaryWidgetComponent,
    MediaQueryWidgetComponent,
    PeopleOnBoardWidgetComponent,
    PresidentMessageWidgetComponent
} from './index';

import {
    BroadcastWidgetService,
    CasualtySummaryWidgetService,
    ChecklistSummaryWidgetService,
    ClockWidgetService,
    DemandSummaryWidgetService,
    MediaQueryWidgetService,
    PeopleOnBoardWidgetService,
    PresidentMessageWidgetService
} from './index';

const WIDGET_COMPONENTS: any[] = [
    BroadcastWidgetComponent,
    CasualtySummaryWidgetComponent,
    ChecklistSummaryWidgetComponent,
    ClockWidgetComponent,
    DemandSummaryWidgetComponent,
    MediaQueryWidgetComponent,
    PeopleOnBoardWidgetComponent,
    PresidentMessageWidgetComponent
];

const WIDGET_SERVICE: any[] = [
    BroadcastWidgetService,
    CasualtySummaryWidgetService,
    ChecklistSummaryWidgetService,
    ClockWidgetService,
    DemandSummaryWidgetService,
    MediaQueryWidgetService,
    PeopleOnBoardWidgetService,
    PresidentMessageWidgetService
];

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        RouterModule
    ],
    exports: [
        ...WIDGET_COMPONENTS
    ],
    declarations: [
        ...WIDGET_COMPONENTS
    ],
    providers: [
        ...WIDGET_SERVICE
    ],
})
export class WidgetModule { }
