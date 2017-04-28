import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../../shared/shared.module';
import { ArchiveListService } from "./archive.dashboard.list.service";
import { ArchiveDashboardRouting } from './archive.dashboard.list.routing';
import { ArchiveDashboardListComponent } from './archive.dashboard.list.component';
import { WidgetModule } from '../widgets';
import { IncidentService } from '../incident';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { ModalModule, ModalDirective } from 'ng2-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        SharedModule,
        MdCheckboxModule,
        WidgetModule,
        ArchiveDashboardRouting,
        ModalModule.forRoot(),
    ],
    declarations: [
        ArchiveDashboardListComponent
    ],
    providers: [
        IncidentService,
        ArchiveListService,
        ToastrService
    ]
})
export class ArchiveDashboardListModule { }