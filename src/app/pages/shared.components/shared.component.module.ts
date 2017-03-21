import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'ng2-bootstrap';
import { SharedModule } from '../../shared';
import { MasterDateModule } from '../masterdata'
import { IncidentModule } from '../incident';

import {
    FlightService,
    InvolvePartyService,
    ActionableService,
    AffectedService,
    AffectedObjectsService,
    AffectedPeopleService,
    BroadcastService,
    EnquiryService,
    DemandService,
    MediaService,
    PresidentMessageService
} from './';

const SHARED_COMPONENT_SERVICES: any[] = [
    FlightService,
    InvolvePartyService,
    ActionableService,
    AffectedService,
    AffectedObjectsService,
    AffectedPeopleService,
    BroadcastService,
    EnquiryService,
    DemandService,
    MediaService,
    PresidentMessageService
];

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        SharedModule,
        MasterDateModule
    ],
    exports: [
    ]
})
export class SharedComponentModule {
    static expose(): ModuleWithProviders {
        let moduleProvider: ModuleWithProviders = <ModuleWithProviders>{
            ngModule: SharedComponentModule,
            providers: [
                ...SHARED_COMPONENT_SERVICES
            ]
        };
        return moduleProvider;
    }
}