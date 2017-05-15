import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IncidentService } from '../incident';
import { LoginRoutings } from './login.routing';
import { LoginComponent } from './components';
import { UserProfileService } from '../shared.components';
import { LoginRootComponent } from './login.root.component';
import { ForgotPasswordComponent } from './components/forgot.password.component';

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
        ForgotPasswordComponent
    ],
    providers: [
        IncidentService,
        UserProfileService
    ]
})
export class LoginModule {
}