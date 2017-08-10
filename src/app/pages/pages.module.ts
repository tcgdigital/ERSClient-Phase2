import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpModule } from '@angular/http';
import {
    GlobalStateService, NotificationBroadcastService,
    NotificationModule
} from '../shared';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { PagesRouting } from './pages.routing';
import { MasterDateModule } from './masterdata';
import { IncidentModule } from './incident';
import { RouteGuardService } from '../shared/services';
import {
    ChangePasswordService,
    ChangePasswordComponent
} from './shared.components/change.password';
import { ContactInfoComponent } from './shared.components/contact.info';
import { AuthenticationService } from './login/components/authentication.service';
import { UserPermissionService } from './masterdata/userpermission/components';
import { QuickLinkQuickViewWidgetComponent } from '../pages/widgets/quicklink.quickview.widget';
import { QuickLinkService } from './masterdata/quicklink/components';
import { WidgetModule } from './widgets';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        SharedModule,
        NotificationModule,
        IncidentModule,
        MasterDateModule,
        ToastrModule,
        ModalModule,
        WidgetModule,
        PagesRouting
    ],
    declarations: [
        PagesComponent,
        ChangePasswordComponent,
        ContactInfoComponent,
        QuickLinkQuickViewWidgetComponent
    ],
    providers: [
        GlobalStateService,
        AuthenticationService,
        UserPermissionService,
        QuickLinkService,
        RouteGuardService
    ]
})
export class PagesModule {
}