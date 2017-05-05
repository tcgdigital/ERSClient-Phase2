import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { AuthenticationService } from './authentication.service';
import { UtilityService } from '../../../shared/services';
import { GlobalStateService, ResponseModel } from '../../../shared';
import { AuthRequestModel, AuthResponseModel } from './auth.model';
import { IncidentModel, IncidentService } from "../../incident";
import { UserProfileService, UserProfileModel } from "../../shared.components";
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import * as jwtDecode from 'jwt-decode';

@Component({
    selector: 'login',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/login.view.html',
    styleUrls: ['../styles/login.style.scss'],
    providers: [AuthenticationService]
})
export class LoginComponent {
    public form: FormGroup;
    public userId: AbstractControl;
    public password: AbstractControl;
    public submitted: boolean;

    constructor(formBuilder: FormBuilder,
        private userProfileService: UserProfileService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private authService: AuthenticationService,
        private globalState: GlobalStateService,
        private router: Router,
        private incidentService: IncidentService) {
        this.form = formBuilder.group({
            userId: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(4)])]
        });

        this.userId = this.form.controls['userId'];
        this.password = this.form.controls['password'];
    }

    Login(userid: string, password: string): void {

        this.authService.Login(userid, password)
            .subscribe((data: AuthResponseModel) => {
                console.log(jwtDecode(data.access_token));
                var loginCredentialBasic = jwtDecode(data.access_token);
                localStorage.setItem('LastLoginTime', (new Date()).toString());
                UtilityService.SetToSession({ 'CurrentUserId': loginCredentialBasic.UserId });
                this.GetUserInfoFromUserProfileByUserProfileId(loginCredentialBasic.UserId);


            }, (error: any) => {
                console.log(`Error: ${error}`);
                if (error.error == 'invalid_grant') {
                    this.toastrService.error(error.error_description, 'Invalid Grant', this.toastrConfig);
                }

                console.log('Notify User Clicked error');
            });
    }

    private CheckClosedIncident(): void {
        this.incidentService.GetOpenIncidents()
            .subscribe((item: ResponseModel<IncidentModel>) => {
                if (item.Count > 0) {
                    this.router.navigate(['pages/dashboard']);
                }
                else {
                    this.router.navigate(['pages/landing']);
                }
            });
    }

    private GetUserInfoFromUserProfileByUserProfileId(id: number): void {
        this.userProfileService.Get(id)
            .subscribe((item: UserProfileModel) => {
                localStorage.setItem('CurrentLoggedInUserName', item.Name);
                this.CheckClosedIncident();
            });
    }

    onSubmit(values: Object): void {
        this.submitted = true;
        if (!this.form.valid) {
            console.log('Invalid Information');
        }
        else {
            this.Login(this.userId.value, this.password.value);
        }
    }
}