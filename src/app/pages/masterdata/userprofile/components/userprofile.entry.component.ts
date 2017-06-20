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
    GlobalConstants, EmailValidator, UtilityService, AuthModel, NameValidator
} from '../../../../shared';

@Component({
    selector: 'userprofile-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/userprofile.entry.view.html'
})
export class UserProfileEntryComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public submitted: boolean = false;
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
        this.submitted = false;
        this.showAdd = false;
        this.initiateForm();
        this.credential = UtilityService.getCredentialDetails();
        this.dataExchange.Subscribe('UserProfileModelToBeModified', (model) => this.onUserProfileModified(model));
    }

    onUserProfileModified(userProfileModel: UserProfileModel): void {
        this.userProfileModel = userProfileModel;
        this.userProfileModel.UserProfileId = userProfileModel.UserProfileId;
        this.Action = 'Edit';
        this.showAdd = true;
    }

    cancel(): void {
        this.initiateForm();
        this.showAdd = false;
        this.submitted = false;
    }

    onSubmit() {
        this.submitted = true;
        if (this.form.valid) {
            let cleanInputValue: string = this.form.controls['Name'].value.replace(/[^\w\s]/gi, '');
            if (cleanInputValue != this.form.controls['Name'].value) {
                this.toastrService.error('User name should consist number or special character.', 'Error', this.toastrConfig);
                return null;
            }
            this.submitted = false;
            if (this.userProfileModel.UserProfileId === 0) {
                this.userProfileModel.CreatedBy = +this.credential.UserId;

                UtilityService.setModelFromFormGroup<UserProfileModel>(this.userProfileModel, this.form,
                    (x) => x.UserProfileId, (x) => x.Email, (x) => x.UserId, (x) => x.Name,
                    (x) => x.MainContact, (x) => x.AlternateContact, (x) => x.Location);

                if (this.form.controls['isActive'].value)
                    this.userProfileModel.isActive = true;
                else
                    this.userProfileModel.isActive = false;

                this.userProfileService.Create(this.userProfileModel)
                    .subscribe((response: UserProfileModel) => {
                        this.form.reset();
                        this.toastrService.success('User profile created Successfully.', 'Success', this.toastrConfig);
                        this.dataExchange.Publish('UserProfileModelCreated', response);
                        this.showAdd = false;

                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                        this.toastrService.error(`${error.message}`, 'Error', this.toastrConfig);
                    });
            }
            else {
                this.userProfileService.Update(this.userProfileModel)
                    .subscribe((response: UserProfileModel) => {
                        this.showAdd = false;
                        this.toastrService.success('User profile edited Successfully.', 'Success', this.toastrConfig);
                        this.dataExchange.Publish('UserProfileModelModified', response);
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                        this.toastrService.error(`${error.message}`, 'Error', this.toastrConfig);
                    });
            }
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
            Email: new FormControl('', [Validators.required, Validators.pattern(GlobalConstants.EMAIL_PATTERN)]),
            UserId: new FormControl('', Validators.required),
            Name: new FormControl('', [Validators.required, NameValidator.validate]),
            MainContact: new FormControl('', [Validators.required, Validators.minLength(14), Validators.maxLength(15), Validators.pattern(GlobalConstants.NUMBER_PATTERN)]),
            AlternateContact: new FormControl('', [Validators.minLength(14), Validators.maxLength(15), Validators.pattern(GlobalConstants.NUMBER_PATTERN)]),
            Location: new FormControl('', Validators.required),
            isActive: new FormControl(1)
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