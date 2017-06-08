import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import * as jwtDecode from 'jwt-decode';
import { RAGScaleService,RAGScaleModel } from "../../../pages/shared.components/ragscale";
import { AuthenticationService } from './authentication.service';
import { UtilityService } from '../../../shared/services';
import { GlobalStateService, ResponseModel } from '../../../shared';
import { AuthRequestModel, AuthResponseModel } from './auth.model';
import { IncidentModel, IncidentService } from '../../incident';
import { UserProfileService, UserProfileModel } from '../../masterdata/userprofile/index';
import { LicensingService } from '../../../shared/services/common.service';
import { LicenseVerificationResponse, LicenseInformationModel } from '../../../shared/models';
import * as _ from 'underscore';

@Component({
    selector: 'login',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/login.view.html',
    styleUrls: ['../styles/login.style.scss'],
    providers: [AuthenticationService,RAGScaleService]
})
export class LoginComponent implements OnInit {
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
        private incidentService: IncidentService,
        private licensingService: LicensingService,
        private ragScaleService: RAGScaleService) {

        this.form = formBuilder.group({
            userId: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(4)])]
        });

        this.userId = this.form.controls['userId'];
        this.password = this.form.controls['password'];
    }

    ngOnInit(): any {
        this.licensingService.VerifyLicense()
            .subscribe((response: LicenseVerificationResponse) => {
                if (response.Code == 105) {
                    this.router.navigate(['/licensing/applykey']);
                }
                else if (response.Code == 101) {
                    this.licensingService.GetLicenseInfo()
                    .subscribe((response: LicenseInformationModel) => {
                        UtilityService.licenseInfo = response;
                    })
                   // UtilityService.licenseInfo=response.Description;
                }
                else {
                    this.router.navigate(['/licensing/invalidkey', response.Code]);
                }
            }, (error) => {

                console.log(error);
            });
    }

    Login(userid: string, password: string): void {
        this.authService.Login(userid, password)
            .subscribe((data: AuthResponseModel) => {
                console.log(jwtDecode(data.access_token));
                const loginCredentialBasic: any = jwtDecode(data.access_token);
                if (loginCredentialBasic) {
                    // This is to check that whether the user has department associated with him. From UserPermission table.
                    //let errorSuccess: boolean = this.userProfileService.VerifyUserDepartmentMapping(+loginCredentialBasic.UserId.toString());


                    if (!Object.keys(loginCredentialBasic).some((x) => x === 'EmailConfirmed')) {
                        localStorage.setItem('LastLoginTime', (new Date()).toString());
                        UtilityService.SetToSession({ CurrentUserId: loginCredentialBasic.UserId });
                        this.GetUserInfoFromUserProfileByUserProfileId(loginCredentialBasic.UserId);
                        this.getRAGScaleData();
                    } else {
                        this.toastrService.warning('Please change your default password', 'Sign In', this.toastrConfig);
                        this.router.navigate(['login/change']);
                    }
                } else {
                    this.toastrService.error('Unable to connect the server or an unspecified exception',
                        'Sign In Exception', this.toastrConfig);
                }
            }, (error: any) => {
                console.log(`Error: ${error}`);
                if (error.error === 'invalid_grant') {
                    this.toastrService.error(error.error_description, 'Sign In Exception', this.toastrConfig);
                } /*else if (error.error === 'invalid_grant_confirm_email') {
                    this.router.navigate(['login/change']);
                }*/
                console.log('Notify User Clicked error');
            });
    }

    public onSubmit(values: object): void {
        this.submitted = true;
        if (!this.form.valid) {
            console.log('Invalid Information');
        }
        else {
            this.Login(this.userId.value, this.password.value);
        }
    }

    private getRAGScaleData() {
        this.ragScaleService.GetAllActive()
        .subscribe((item:ResponseModel<RAGScaleModel>)=>{
            UtilityService.RAGScaleData=item.Records;
        });
    }

    private GetUserInfoFromUserProfileByUserProfileId(id: number): void {
        this.userProfileService.Get(id)
            .subscribe((item: UserProfileModel) => {
                localStorage.setItem('CurrentLoggedInUserName', item.Name);

                this.CheckDepartmentPages(item.UserProfileId);

            });
    }
    private CheckDepartmentPages(UserProfileId: number): void {
        this.userProfileService.GetDepartmentPages(UserProfileId)
            .subscribe((item: ResponseModel<UserProfileModel>) => {
                let userprofile = item.Records;
                let userpermissions = _.flatten(_.pluck(userprofile, 'UserPermissions'));
                let departments = _.flatten(_.pluck(userpermissions, 'Department'));
                if (departments.length <= 0) {
                    this.toastrService.warning('User Not Assigned to Any Department');
                }
                else {
                    let permissions = _.flatten(_.pluck(departments, 'Permissions'));
                    if (permissions.length > 0) {
                        this.CheckClosedIncident();
                    }
                    else {
                        this.toastrService.warning("Departments assigned to this user don't have access to any pages");
                    }
                }

            })
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
}