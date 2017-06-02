import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IncidentService } from '../incident';
import { LoginRoutings } from './login.routing';
import {
    LoginComponent, ForgotPasswordComponent,
    ChangePasswordComponent
} from './components';
import { UserProfileService } from '../masterdata/userprofile/components';
import { LoginRootComponent } from './login.root.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        LoginRoutings
    ],
    declarations: [
        LoginRootComponent,
        LoginComponent,
        ForgotPasswordComponent,
        ChangePasswordComponent
    ],
    providers: [
        IncidentService,
        UserProfileService
    ]
})
export class LoginModule {
}