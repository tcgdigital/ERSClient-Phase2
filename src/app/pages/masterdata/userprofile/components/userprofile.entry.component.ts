import {
    Component, ViewEncapsulation,
    Output, EventEmitter, OnInit, OnDestroy, ViewChild
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
<<<<<<< HEAD
    GlobalConstants, EmailValidator, UtilityService, AuthModel, NameValidator, UserIdValidator, FileData, FileUploadService
=======
    GlobalConstants, EmailValidator, UtilityService, AuthModel, UserIdValidator
>>>>>>> master
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
    userProfileModeltoUpdate: UserProfileModel;
    @ViewChild('inputFileUserProfile') inputFileUserProfile: any;
    filesToUpload: FileData[] = [];
    objFileData : FileData;
    disableUploadButton: boolean = true;

    constructor(private userProfileService: UserProfileService,
        private dataExchange: DataExchangeService<UserProfileModel>,
        private userAuthService: UserAuthService,
        private fileUploadService: FileUploadService,
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
        this.form = new FormGroup({
            UserProfileId: new FormControl(userProfileModel.UserProfileId),
            Email: new FormControl(userProfileModel.Email, [Validators.required, Validators.pattern(GlobalConstants.EMAIL_PATTERN)]),
            UserId: new FormControl(userProfileModel.UserId, [Validators.required, UserIdValidator.validate]),
            Name: new FormControl(userProfileModel.Name, [Validators.required]),
            MainContact: new FormControl(userProfileModel.MainContact, [Validators.required, Validators.minLength(14), Validators.maxLength(15), Validators.pattern(GlobalConstants.NUMBER_PATTERN)]),
            AlternateContact: new FormControl(userProfileModel.AlternateContact, [Validators.minLength(14), Validators.maxLength(15), Validators.pattern(GlobalConstants.NUMBER_PATTERN)]),
            Location: new FormControl(userProfileModel.Location, Validators.required),
            isActive: new FormControl(userProfileModel.isActive),
            isVolunteered: new FormControl(userProfileModel.isVolunteered)
        });
        this.form.controls["UserId"].reset({ value: userProfileModel.UserId, disabled: true });
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
            // let cleanInputValue: string = this.form.controls['Name'].value.replace('');
            // if (cleanInputValue != this.form.controls['Name'].value) {
            //     this.toastrService.error('User name should consist number or special character.', 'Error', this.toastrConfig);
            //     return null;
            // }
            this.submitted = false;
            if (this.userProfileModel.UserProfileId === 0) {
                this.userProfileModel.CreatedBy = +this.credential.UserId;

                UtilityService.setModelFromFormGroup<UserProfileModel>(this.userProfileModel, this.form,
                    (x) => x.UserProfileId, (x) => x.Email, (x) => x.UserId, (x) => x.Name,
                    (x) => x.MainContact, (x) => x.AlternateContact, (x) => x.Location);
                this.userProfileModel.isActive = this.form.controls['isActive'].value;
                this.userProfileModel.isVolunteered = this.form.controls['isVolunteered'].value;
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
                this.formControlDirtyCheck();
                this.userProfileService.Update(this.userProfileModeltoUpdate, this.userProfileModeltoUpdate.UserProfileId)
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

    formControlDirtyCheck(): void {
        this.userProfileModeltoUpdate = new UserProfileModel();
        this.userProfileModeltoUpdate.deleteAttributes();
        this.userProfileModeltoUpdate.UserProfileId = this.form.controls['UserProfileId'].value;

        if (this.form.controls['Email'].touched) {
            this.userProfileModeltoUpdate.Email = this.form.controls['Email'].value;
        }
        if (this.form.controls['Name'].touched) {
            this.userProfileModeltoUpdate.Name = this.form.controls['Name'].value;
        }
        if (this.form.controls['MainContact'].touched) {
            this.userProfileModeltoUpdate.MainContact = this.form.controls['MainContact'].value;
        }
        if (this.form.controls['AlternateContact'].touched) {
            this.userProfileModeltoUpdate.AlternateContact = this.form.controls['AlternateContact'].value;
        }
        if (this.form.controls['Location'].touched) {
            this.userProfileModeltoUpdate.Location = this.form.controls['Location'].value;
        }
        if (this.form.controls['isActive'].touched) {
            this.userProfileModeltoUpdate.isActive = this.form.controls['isActive'].value;
        }
        if (this.form.controls['isVolunteered'].touched) {
            this.userProfileModeltoUpdate.isVolunteered = this.form.controls['isVolunteered'].value;
        }
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('UserProfileModelModified');
    }

    showAddRegion() {
        this.showAdd = true;
        this.initiateForm();
    }

    uploadFiles(): void {
        if (this.inputFileUserProfile.nativeElement.value !== '') {
            this.disableUploadButton = false;
            const baseUrl = GlobalConstants.EXTERNAL_URL;
            const param = 'IncidentId=' + '0' + '&CreatedBy=' + this.credential.UserId;

            this.fileUploadService.uploadFiles<string>(baseUrl + './api/MasterDataUploadBatch?' + param, this.filesToUpload)
                .subscribe((result: any) => {
                    console.log('success');
                    this.filesToUpload = [];
                    this.toastrService.success('Uploaded Data is processed successfully.' + '\n'
                        + 'To check any invalid records, please refer \'View Invalid Records\' link for the current timestamp.', 'Success', this.toastrConfig);

                    this.form.reset();
                    this.disableUploadButton = true;
                    this.dataExchange.Publish('UserProfileLoadedFromFile', result);
                    this.showAdd = false;

                }, (error) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
            this.disableUploadButton = true;
        }
    }

    private initiateForm(): void {
        this.userProfileModel = new UserProfileModel();
        this.Action = 'Save';

        this.form = new FormGroup({
            UserProfileId: new FormControl(0),
            Email: new FormControl('', [Validators.required, Validators.pattern(GlobalConstants.EMAIL_PATTERN)]),
            UserId: new FormControl('', [Validators.required, UserIdValidator.validate]),
            Name: new FormControl('', [Validators.required]),
            MainContact: new FormControl('', [Validators.required, Validators.minLength(14), Validators.maxLength(15), Validators.pattern(GlobalConstants.NUMBER_PATTERN)]),
            AlternateContact: new FormControl('', [Validators.minLength(14), Validators.maxLength(15), Validators.pattern(GlobalConstants.NUMBER_PATTERN)]),
            Location: new FormControl('', Validators.required),
            isActive: new FormControl(true),
            isVolunteered: new FormControl(false),
            fileUserProfile : new FormControl()
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

    private getFileDetails(e: any, type: string): void {
        this.disableUploadButton = false;

        for (let i = 0; i < e.target.files.length; i++) {
            const extension = e.target.files[i].name.split('.').pop();

            if (extension.toLowerCase() === 'xls' || extension.toLowerCase() === 'xlsx' || extension.toLowerCase() === 'csv') {
                this.objFileData = new FileData();
                this.objFileData.field = type;
                this.objFileData.file = e.target.files[i];
                this.filesToUpload.push(this.objFileData);
            }
            else {
                this.toastrService.error('Invalid File Format!', 'Error', this.toastrConfig);
                
                this.reset();
                this.disableUploadButton = true;
            }
        }
    }



    private reset(): void {
        this.inputFileUserProfile.nativeElement.value = '';
        this.disableUploadButton = true;
    }
}