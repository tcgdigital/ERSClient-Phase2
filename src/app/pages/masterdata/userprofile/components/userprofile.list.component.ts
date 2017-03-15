import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { UserProfileService } from './userprofile.service';
import { UserProfileModel } from './userprofile.model';
import { ResponseModel, DataExchangeService } from '../../../../shared';

@Component({
    selector: 'userprofile-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/userprofile.list.view.html'
})
export class UserProfileListComponent implements OnInit, OnDestroy {
    userProfiles: UserProfileModel[] = [];

    constructor(private userProfileService: UserProfileService,
        private dataExchange: DataExchangeService<UserProfileModel>) { }

    getUserProfiles(): void {
        this.userProfileService.GetAll()
            .subscribe((response: ResponseModel<UserProfileModel>) => {
                this.userProfiles = response.Records;
            });
    }

    onUserProfileSuccess(data: UserProfileModel): void {
        this.getUserProfiles();
    }

    UpdateUserProfile(userProfileModelUpdate: UserProfileModel): void {
        let userProfileModelToSend = Object.assign({}, userProfileModelUpdate)
        this.dataExchange.Publish("UserProfileModelToBeModified", userProfileModelToSend);
    }

    ngOnInit(): any {
        this.getUserProfiles();
        this.dataExchange.Subscribe("UserProfileModelCreated", model => this.onUserProfileSuccess(model));
        this.dataExchange.Subscribe("UserProfileModelModified", model => this.onUserProfileSuccess(model));
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('UserProfileModelCreated');
        this.dataExchange.Unsubscribe('UserProfileModelModified');
    }
}