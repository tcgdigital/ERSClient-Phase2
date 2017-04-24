import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdCheckboxModule } from '@angular2-material/checkbox';

import { NotifyPeopleRouting } from './notifypeople.routing';
import { NotifyPeopleComponent } from './notifypeople.component';
import { NotifyPeopleService } from './components';
import { DataExchangeService, SharedModule } from '../../shared';
import { UserPermissionService } from '../masterdata/userpermission/components/userpermission.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        MdCheckboxModule,
        SharedModule,
        NotifyPeopleRouting
    ],
    declarations: [
        NotifyPeopleComponent
    ],
    providers: [
        NotifyPeopleService,
        DataExchangeService,
        UserPermissionService
    ]
})
export class NotifyPeopleModule { }