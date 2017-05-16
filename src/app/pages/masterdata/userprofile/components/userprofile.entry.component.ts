import {
    Component, ViewEncapsulation,
    Output, EventEmitter, OnInit, OnDestroy
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
    FormGroup, FormControl,
    FormBuilder, AbstractControl, Validators
} from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

import { UserProfileService } from './userprofile.service';
import { UserProfileModel, UserAuthenticationModel } from './userprofile.model';
import { UserAuthService } from './user.auth.service';
import { GenericSearchComponent } from '../../../../shared/components/generic.search/generic.search.component';
import { AccountResponse } from '../../../../shared/models';

import {
    ResponseModel, DataExchangeService,
    GlobalConstants, EmailValidator, UtilityService, AuthModel
} from '../../../../shared';

@Component({
    selector: 'userprofile-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/userprofile.entry.view.html'
})
export class UserProfileEntryComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    mailAddress: FormControl;
    userProfileModel: UserProfileModel = new UserProfileModel();
    date: Date = new Date();
    userProfiles: UserProfileModel[] = [];
    Action: string;
    numaricRegex = '/^[0-9]{10,10}$/';
    showAdd: boolean;
    credential: AuthModel;

    constructor(private userProfileService: UserProfileService,
        private dataExchange: DataExchangeService<UserProfileModel>,
        private userAuthService: UserAuthService,
        private builder: FormBuilder,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) {
    }

    ngOnInit(): void {
        this.showAdd = false;
        this.initiateForm();
        this.credential = UtilityService.getCredentialDetails();
        this.dataExchange.Subscribe('UserProfileModelToBeModified', (model) => this.onUserProfileModified(model));
    }

    onUserProfileModified(userProfileModel: UserProfileModel): void {
        debugger;
        this.userProfileModel = userProfileModel;
        this.userProfileModel.UserProfileId = userProfileModel.UserProfileId;
        this.Action = 'Edit';
        this.showAdd = true;
    }

    cancel(): void {
        this.initiateForm();
        this.showAdd = false;
    }

    onSubmit() {
        if (this.form.valid) {
            if (this.userProfileModel.UserProfileId === 0) {
                this.userProfileModel.CreatedBy = +this.credential.UserId;

                UtilityService.setModelFromFormGroup<UserProfileModel>(this.userProfileModel, this.form,
                    (x) => x.UserProfileId, (x) => x.Email, (x) => x.UserId, (x) => x.Name,
                    (x) => x.MainContact, (x) => x.AlternateContact, (x) => x.Location);

                if (this.form.controls['isActive'].value === 0)
                    this.userProfileModel.ActiveFlag = 'Active';
                else
                    this.userProfileModel.ActiveFlag = 'InActive';

                this.userProfileService.Create(this.userProfileModel)
                    .subscribe((response: UserProfileModel) => {
                        this.form.reset();
                        this.toastrService.success('User profile created Successfully.', 'Success', this.toastrConfig);
                        this.dataExchange.Publish('UserProfileModelCreated', response);

                        // this.userAuthService.CreateUserAccess(this.generateUserAuthData(response))
                        //     .subscribe((acctresponse: AccountResponse) => {
                        //         if (acctresponse) {
                        //             if (acctresponse.Code === 1001) {
                        //                 this.toastrService.success('User profile created Successfully.', 'Success', this.toastrConfig);
                        //                 this.dataExchange.Publish('UserProfileModelCreated', response);
                        //             } else {
                        //                 this.toastrService.error('Unable to create the user profile', 'Error', this.toastrConfig);
                        //             }
                        //         }
                        //     });

                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            }
            else {
                this.userProfileService.Update(this.userProfileModel)
                    .subscribe((response: UserProfileModel) => {
                        this.toastrService.success('User profile edited Successfully.', 'Success', this.toastrConfig);
                        this.dataExchange.Publish('UserProfileModelModified', response);
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            }
        }
        if (this.form.controls['UserId'].value == '') {
            this.toastrService.error('Please provide user id.', 'Error', this.toastrConfig);
            return null;
        }
        if (this.form.controls['Name'].value == '') {
            this.toastrService.error('Please provide name.', 'Error', this.toastrConfig);
            return null;
        }
        if (this.form.controls['MainContact'].value == '') {
            this.toastrService.error('Please provide main contact.', 'Error', this.toastrConfig);
            return null;
        }
        if (this.form.controls['Location'].value == '') {
            this.toastrService.error('Please provide location.', 'Error', this.toastrConfig);
            return null;
        }

        this.userProfileModel.Email = this.form.controls["Email"].value;
        this.userProfileModel.UserId = this.form.controls["UserId"].value;
        this.userProfileModel.Name = this.form.controls["Name"].value;
        this.userProfileModel.Location = this.form.controls["Location"].value;
        this.userProfileModel.isActive = this.form.controls["isActive"].value;

        if (this.userProfileModel.UserProfileId == 0) {
            this.userProfileModel.CreatedBy = +this.credential.UserId;
            UtilityService.setModelFromFormGroup<UserProfileModel>(this.userProfileModel, this.form,
                x => x.UserProfileId, x => x.Email, x => x.UserId, x => x.Name,
                x => x.MainContact, x => x.AlternateContact, x => x.Location);

            if (this.form.controls["isActive"].value == 0)
                this.userProfileModel.ActiveFlag = "Active";
            else
                this.userProfileModel.ActiveFlag = "InActive";

            this.userProfileService.Create(this.userProfileModel)
                .subscribe((response: UserProfileModel) => {
                    this.toastrService.success('User profile created Successfully.', 'Success', this.toastrConfig);
                    this.dataExchange.Publish("UserProfileModelCreated", response);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
            this.userProfileService.Update(this.userProfileModel)
                .subscribe((response: UserProfileModel) => {
                    this.toastrService.success('User profile edited Successfully.', 'Success', this.toastrConfig);
                    this.dataExchange.Publish("UserProfileModelModified", response);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }

    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('UserProfileModelModified');
    }

    showAddRegion() {
        this.showAdd = true;
        this.initiateForm();
    }

    private initiateForm(): void {
        this.userProfileModel = new UserProfileModel();
        this.Action = 'Save';

        this.form = new FormGroup({
            UserProfileId: new FormControl(0),
            Email: new FormControl('', [Validators.required, EmailValidator.validate]),
            UserId: new FormControl('', Validators.required),
            Name: new FormControl('', Validators.required),
            MainContact: new FormControl('', Validators.required),
            AlternateContact: new FormControl(''),
            Location: new FormControl('', Validators.required),
            isActive: new FormControl(0)
        });
    }

    private generateUserAuthData(userProfile: UserProfileModel): UserAuthenticationModel {
        const userAuthenticationModel: UserAuthenticationModel = new UserAuthenticationModel();
        userAuthenticationModel.Email = userProfile.Email;
        userAuthenticationModel.PhoneNumber = userProfile.MainContact;
        userAuthenticationModel.UserName = userProfile.UserId;
        userAuthenticationModel.EmailConfirmed = true;
        userAuthenticationModel.Password = 'P@ssw0rd';
        userAuthenticationModel.ConfirmPassword = 'P@ssw0rd';

        return userAuthenticationModel;
    }
}