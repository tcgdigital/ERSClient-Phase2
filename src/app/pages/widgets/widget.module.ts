import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AffectedPeopleService } from '../shared.components/affected.people';
import { EnquiryService } from '../shared.components/call.centre';
import { ActionableService } from '../shared.components/actionables';
import { DemandService } from '../shared.components/demand';
import { DepartmentAccessOwnerService } from '../shared.components/departmentaccessowner';
import { ModalModule, ModalDirective } from 'ng2-bootstrap';
import { SharedModule } from '../../shared';
import {
    BroadcastWidgetComponent, 
    CasualtySummaryWidgetComponent,
    ChecklistSummaryWidgetComponent,
    ClockWidgetComponent,
    DemandReceivedSummaryWidgetComponent,
    DemandRaisedSummaryWidgetComponent,
    MediaReleaseWidgetComponent,
    PeopleOnBoardWidgetComponent,
    PresidentMessageWidgetComponent,
} from './index';

import {
    BroadcastWidgetService,
    CasualtySummaryWidgetService,
    ChecklistSummaryWidgetService,
    ClockWidgetService,
    DemandReceivedSummaryWidgetService,
    DemandRaisedSummaryWidgetService,
    MediaReleaseWidgetService,
    PeopleOnBoardWidgetService,
    PresidentMessageWidgetService
} from './index';

const WIDGET_COMPONENTS: any[] = [
    BroadcastWidgetComponent,  
    CasualtySummaryWidgetComponent,
    ChecklistSummaryWidgetComponent,
    ClockWidgetComponent,
    DemandReceivedSummaryWidgetComponent,
    DemandRaisedSummaryWidgetComponent,
    MediaReleaseWidgetComponent,
    PeopleOnBoardWidgetComponent,
    PresidentMessageWidgetComponent,
];

const WIDGET_SERVICE: any[] = [
    BroadcastWidgetService,
    CasualtySummaryWidgetService,
    ChecklistSummaryWidgetService,
    ClockWidgetService,
    DemandReceivedSummaryWidgetService,
    DemandRaisedSummaryWidgetService,
    MediaReleaseWidgetService,
    PeopleOnBoardWidgetService,
    PresidentMessageWidgetService,
    AffectedPeopleService,
    EnquiryService,
    ActionableService,
    DemandService,
    DepartmentAccessOwnerService
];

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        ModalModule.forRoot(),        
        SharedModule,
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
