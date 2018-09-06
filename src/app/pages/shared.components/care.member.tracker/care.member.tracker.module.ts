import { NgModule } from '@angular/core';
import { CareMemberTrackerComponent, CareMemberTrackerService } from './components';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../../shared';
import { AffectedPeopleService } from '../affected.people';
import { CareMemberTrackerForAllComponent } from './components/care.member.tracker.forall.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        SharedModule
    ],
    exports: [
        CareMemberTrackerComponent,
        CareMemberTrackerForAllComponent
    ],
    declarations: [
        CareMemberTrackerComponent,
        CareMemberTrackerForAllComponent
    ],
    providers: [
        CareMemberTrackerService,
        AffectedPeopleService
    ],
})
export class CareMemberTrackerModule { }
