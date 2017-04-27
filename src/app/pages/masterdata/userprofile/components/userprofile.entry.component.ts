import { Component, ViewEncapsulation, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

import { UserProfileService } from './userprofile.service';
import { UserProfileModel } from './userprofile.model';

import { ResponseModel, DataExchangeService, GlobalConstants, EmailValidator, UtilityService } from '../../../../shared';

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
    numaricRegex = "/^[0-9]{10,10}$/";
    showAdd : boolean;

    constructor(private userProfileService: UserProfileService,
        private dataExchange: DataExchangeService<UserProfileModel>,
        private builder: FormBuilder) {
    }

    ngOnInit(): void {
        this.showAdd = false;
        this.initiateForm();
        this.dataExchange.Subscribe("UserProfileModelToBeModified", model => this.onUserProfileModified(model))
    }

    onUserProfileModified(userProfileModel: UserProfileModel): void {
        this.userProfileModel = userProfileModel;
        this.userProfileModel.UserProfileId = userProfileModel.UserProfileId
        this.Action = "Edit";
        this.showAdd = true;
    }

    cancel(): void {
        this.initiateForm();
        this.showAdd = false;
    }

    onSubmit() {
        if (this.userProfileModel.UserProfileId == 0) {
            UtilityService.setModelFromFormGroup<UserProfileModel>(this.userProfileModel, this.form,
                x => x.UserProfileId, x => x.Email, x => x.UserId, x => x.Name,
                x => x.MainContact, x => x.AlternateContact, x => x.Location);

            if (this.form.controls["isActive"].value == 0)
                this.userProfileModel.ActiveFlag = "Active";
            else
                this.userProfileModel.ActiveFlag = "InActive";

            this.userProfileService.Create(this.userProfileModel)
                .subscribe((response: UserProfileModel) => {
                    this.dataExchange.Publish("UserProfileModelCreated", response);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }

        else {
            this.userProfileService.Update(this.userProfileModel)
                .subscribe((response: UserProfileModel) => {
                    this.dataExchange.Publish("UserProfileModelModified", response);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('UserProfileModelModified');
    }

    private initiateForm(): void {
        this.userProfileModel = new UserProfileModel();
        this.Action = "Save";

        this.form = new FormGroup({
            UserProfileId: new FormControl(0),
            Email: new FormControl('', [Validators.required, EmailValidator.validate]),
            UserId: new FormControl('', Validators.required),
            Name: new FormControl('', Validators.required),
            MainContact: new FormControl('', Validators.required),
            AlternateContact: new FormControl('', Validators.required),
            Location: new FormControl('', Validators.required),
            isActive: new FormControl(0)
        })
    }

    showAddRegion(){
        this.showAdd = true;
        this.initiateForm();

    }
}