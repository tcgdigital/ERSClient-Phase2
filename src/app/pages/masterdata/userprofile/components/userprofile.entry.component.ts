import {
    Component, ViewEncapsulation,
    OnInit, OnDestroy, ViewChild
} from '@angular/core';
import {
    FormGroup, FormControl, Validators
} from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { UserProfileService } from './userprofile.service';
import { UserProfileModel, UserAuthenticationModel } from './userprofile.model';
import { ValidationResultModel } from '../../../../shared/models';

import {
    DataExchangeService, GlobalConstants,
    UtilityService, AuthModel, UserIdValidator,
    FileData, FileUploadService
} from '../../../../shared';
import { Subject } from 'rxjs/Subject';

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
    showAdd: boolean = false;
    credential: AuthModel;
    userProfileModeltoUpdate: UserProfileModel;
    @ViewChild('inputFileUserProfile') inputFileUserProfile: any;
    filesToUpload: FileData[] = [];
    objFileData: FileData;
    disableUploadButton: boolean = true;
    HRInfoTemplatePath: string = './assets/static-content/PRHR_YYYYMMDD.csv';
    HRTrainingTemplatePath: string = './assets/static-content/PRHR_Training_YYYYMMDD.csv';
    public showAddText: string = 'ADD USER';
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private userProfileService: UserProfileService,
        private dataExchange: DataExchangeService<UserProfileModel>,
        private fileUploadService: FileUploadService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) {
    }

    ngOnInit(): void {
        this.submitted = false;
        this.showAdd = false;
        this.initiateForm();
        this.credential = UtilityService.getCredentialDetails();

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.UserProfileModelToBeModified,
            (model: UserProfileModel) => this.onUserProfileModified(model));
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
            MainContact: new FormControl(userProfileModel.MainContact, [Validators.required]),
            AlternateContact: new FormControl(userProfileModel.AlternateContact),
            EmployeeId: new FormControl(userProfileModel.EmployeeId),
            isActive: new FormControl(userProfileModel.isActive),
            isVolunteered: new FormControl(userProfileModel.isVolunteered)
        });
        this.form.controls["UserId"].reset({ value: userProfileModel.UserId, disabled: true });
        this.showAdd = true;
        window.scrollTo(0, 0);
    }

    cancel(): void {
        this.initiateForm();
        this.showAddRegion(this.showAdd);
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
                    (x) => x.MainContact, (x) => x.AlternateContact, (x) => x.EmployeeId);
                this.userProfileModel.isActive = this.form.controls['isActive'].value;
                this.userProfileModel.isVolunteered = this.form.controls['isVolunteered'].value;
                this.userProfileModel.Location = 'Not Available';

                this.userProfileService.Create(this.userProfileModel)
                    .subscribe((response: UserProfileModel) => {
                        this.initiateForm();
                        this.toastrService.success('User profile created Successfully.', 'Success', this.toastrConfig);
                        this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.UserProfileModelCreated, response);
                        this.showAddRegion(this.showAdd);
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
                        this.initiateForm();
                        this.showAddRegion(this.showAdd);
                        this.showAdd = false;
                        this.toastrService.success('User profile edited Successfully.', 'Success', this.toastrConfig);
                        this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.UserProfileModelModified, response);
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
        if (this.form.controls['EmployeeId'].touched) {
            this.userProfileModeltoUpdate.EmployeeId = this.form.controls['EmployeeId'].value;
        }
        if (this.form.controls['isActive'].touched) {
            this.userProfileModeltoUpdate.isActive = this.form.controls['isActive'].value;
        }
        if (this.form.controls['isVolunteered'].touched) {
            this.userProfileModeltoUpdate.isVolunteered = this.form.controls['isVolunteered'].value;
        }

        this.userProfileModeltoUpdate.Location = 'Not Available';
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.UserProfileModelModified);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    showAddRegion(value): void {
        if (!value) {
            this.showAddText = "CLICK TO COLLAPSE";
        }
        else {
            this.showAddText = "ADD USER";
        }
        window.setInterval(() => {
            jQuery(window).scroll();
        }, 100);

        this.showAdd = !value;
    }

    uploadFiles(): void {
        if (this.inputFileUserProfile.nativeElement.value !== '') {
            this.disableUploadButton = false;
            const baseUrl = GlobalConstants.EXTERNAL_URL;
            const param = 'IncidentId=' + '0' + '&CreatedBy=' + this.credential.UserId;

            this.fileUploadService.uploadFiles<ValidationResultModel[]>(baseUrl + './api/MasterDataUploadBatch?' + param, this.filesToUpload)
                .subscribe((result: ValidationResultModel[]) => {
                    console.log('success');
                    this.filesToUpload = [];
                    // this.toastrService.success('Uploaded Data is processed successfully.' + '\n'
                    //     + 'To check any invalid records, please refer \'View Invalid Records\' link for the current timestamp.', 'Success', this.toastrConfig);

                    result.forEach(item => {
                        if (item.ResultType == 1) {
                            this.toastrService.error(item.Message, 'Error', this.toastrConfig);
                        }
                        else if (item.ResultType == 3) {
                            this.toastrService.success(item.Message, 'Success', this.toastrConfig);
                        }
                    });

                    this.inputFileUserProfile.nativeElement.value = "";
                    this.disableUploadButton = true;
                    this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.UserProfileLoadedFromFile, this.userProfileModel);
                    this.showAddRegion(this.showAdd);
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
            MainContact: new FormControl('', [Validators.required]),
            //AlternateContact: new FormControl('', [Validators.required]),
            AlternateContact: new FormControl(''),
            //Location: new FormControl('', Validators.required),
            EmployeeId: new FormControl(''),
            isActive: new FormControl(true),
            isVolunteered: new FormControl(false)
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