import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import * as jwtDecode from 'jwt-decode';
import { RAGScaleService, RAGScaleModel } from '../../../pages/shared.components/ragscale';
import { AuthenticationService } from './authentication.service';
import { UtilityService } from '../../../shared/services';
import { GlobalStateService, ResponseModel, KeyValue, GlobalConstants, StorageType } from '../../../shared';
import { AuthRequestModel, AuthResponseModel } from './auth.model';
import { IncidentModel, IncidentService } from '../../incident';
import { UserProfileService, UserProfileModel } from '../../masterdata/userprofile/index';
import { LicensingService } from '../../../shared/services/common.service';
import { LicenseVerificationResponse, LicenseInformationModel } from '../../../shared/models';
import { UserPermissionService } from '../../masterdata/userpermission/components';
import { UserPermissionModel } from '../../masterdata/userpermission/components';
import { PagePermissionService } from '../../../pages/masterdata/page.functionality/components/page.permission.service';
import { PagesPermissionMatrixModel } from '../../../pages/masterdata/page.functionality/components/page.functionality.model';
import * as _ from 'underscore';

@Component({
    selector: 'login',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/login.view.html',
    styleUrls: ['../styles/login.style.scss'],
    providers: [AuthenticationService, RAGScaleService]
})
export class LoginComponent implements OnInit {
    public form: FormGroup;
    public userId: AbstractControl;
    public password: AbstractControl;
    public submitted: boolean;
    departments: KeyValue[] = [];
    incidents: KeyValue[] = [];
    currentDepartmentId: number = 0;
    currentIncidentId: number = 0;

    constructor(formBuilder: FormBuilder,
        private userProfileService: UserProfileService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private authService: AuthenticationService,
        private globalState: GlobalStateService,
        private router: Router,
        private incidentService: IncidentService,
        private licensingService: LicensingService,
        private ragScaleService: RAGScaleService,
        private userPermissionService: UserPermissionService,
        private pagePermissionService: PagePermissionService) {

        this.form = formBuilder.group({
            userId: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(4)])]
        });

        this.userId = this.form.controls['userId'];
        this.password = this.form.controls['password'];
    }

    public ngOnInit(): void {
        this.licensingService.VerifyLicense()
            .subscribe((response: LicenseVerificationResponse) => {
                if (response.Code === 105) {
                    this.router.navigate(['/licensing/applykey']);
                }
                else if (response.Code === 101) {
                    this.licensingService.GetLicenseInfo()
                        .subscribe((data: LicenseInformationModel) => {
                            UtilityService.licenseInfo = data;
                            UtilityService.SetToSession({ ClientName: UtilityService.licenseInfo.ClientName });
                        });
                }
                else {
                    this.router.navigate(['/licensing/invalidkey', response.Code]);
                }
            }, (error) => {
                console.log(error);
            });
    }

    public Login(userid: string, password: string): void {
        this.authService.Login(userid, password)
            .subscribe((data: AuthResponseModel) => {

                console.log(jwtDecode(data.access_token));
                const loginCredentialBasic: any = jwtDecode(data.access_token);
                this.pagePermissionService.GetPagePermissionMatrix(loginCredentialBasic.UserId)
                    .subscribe((item: PagesPermissionMatrixModel[]) => {
                        GlobalConstants.PagePermissionMatrix = [];
                        UtilityService.SetToSession({ PagePermissionMatrix: item },
                            StorageType.SessionStorage, true);
                        GlobalConstants.PagePermissionMatrix = item;
                        if (loginCredentialBasic) {
                            // This is to check that whether the user has department associated with him. From UserPermission table.
                            // let errorSuccess: boolean = this.userProfileService.VerifyUserDepartmentMapping(+loginCredentialBasic.UserId.toString());
                            this.getDepartments(loginCredentialBasic.UserId);
                            GlobalConstants.currentLoggedInUser = +loginCredentialBasic.UserId.toString();
                            this.getIncidents();

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
                    });

            }, (error: any) => {
                console.log(`Error: ${error}`);
                if (error.error === 'invalid_grant') {
                    this.toastrService.error(error.error_description, 'Sign In Exception', this.toastrConfig);
                }
                console.log('Notify User Clicked error');
            }, () => {
                console.log('Completed');
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

    private getDepartments(userId: number): void {
        this.userPermissionService.GetAllDepartmentsAssignedToUser(userId)
            .map((x: ResponseModel<UserPermissionModel>) => x.Records.sort((a, b) => {
                if (a.Department.DepartmentName < b.Department.DepartmentName) return -1;
                if (a.Department.DepartmentName > b.Department.DepartmentName) return 1;
                return 0;
            })
            ).subscribe((x: UserPermissionModel[]) => {
                this.departments = x.map((y: UserPermissionModel) =>
                    new KeyValue(y.Department.DepartmentName, y.Department.DepartmentId));
                if (this.departments.length > 0) {
                    this.currentDepartmentId = this.departments[0].Value;
                    console.log(this.currentDepartmentId);
                    UtilityService.SetToSession({ CurrentDepartmentId: this.currentDepartmentId });
                }
            });
    }

    private getIncidents(): void {
        this.incidentService.GetAllActiveIncidents()
            .map((x: ResponseModel<IncidentModel>) => x.Records.sort((a, b) => {
                const dateA = new Date(a.CreatedOn).getTime();
                const dateB = new Date(b.CreatedOn).getTime();
                return dateA > dateB ? 1 : -1;
            })).subscribe((x: IncidentModel[]) => {
                this.incidents = x.map((y: IncidentModel) => new KeyValue(y.EmergencyName, y.IncidentId));
                if (this.incidents.length > 0) {
                    this.currentIncidentId = this.incidents[0].Value;
                    console.log(this.currentIncidentId);
                    UtilityService.SetToSession({ CurrentIncidentId: this.currentIncidentId });
                }

            });
    }

    private getRAGScaleData() {
        this.ragScaleService.GetAllActive()
            .subscribe((item: ResponseModel<RAGScaleModel>) => {
                UtilityService.RAGScaleData = item.Records;
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
                const userprofile = item.Records;
                const userpermissions = _.flatten(_.pluck(userprofile, 'UserPermissions'));
                const departments = _.flatten(_.pluck(userpermissions, 'Department'));
                if (departments.length <= 0) {
                    this.toastrService.warning('User Not Assigned to Any Department');
                }
                else {
                    const permissions = _.flatten(_.pluck(departments, 'Permissions'));
                    if (permissions.length > 0) {
                        this.CheckClosedIncident();
                    }
                    else {
                        this.toastrService.warning('Departments assigned to this user don\'t have access to any pages');
                    }
                }
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
}