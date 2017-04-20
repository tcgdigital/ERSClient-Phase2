import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { UserProfileService } from './userprofile.service';
import { UserProfileModel } from './userprofile.model';
import {
    ResponseModel, DataExchangeService, SearchConfigModel,
    SearchTextBox, SearchDropdown,
    NameValue
} from '../../../../shared';
import { Observable } from 'rxjs/Rx';


@Component({
    selector: 'userprofile-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/userprofile.list.view.html'
})
export class UserProfileListComponent implements OnInit, OnDestroy {
    userProfiles: UserProfileModel[] = [];
    searchConfigs: SearchConfigModel<any>[] = [];

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
        this.initiateSearchConfigurations();
        this.dataExchange.Subscribe("UserProfileModelCreated", model => this.onUserProfileSuccess(model));
        this.dataExchange.Subscribe("UserProfileModelModified", model => this.onUserProfileSuccess(model));
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('UserProfileModelCreated');
        this.dataExchange.Unsubscribe('UserProfileModelModified');
    }

    invokeSearch(query: string): void {
        if (query !== '') {
            this.userProfileService.GetQuery(query)
                .subscribe((response: ResponseModel<UserProfileModel>) => {
                    this.userProfiles = response.Records;
                }, ((error: any) => {
                    console.log(`Error: ${error}`);
                }));
        }
    }

    invokeReset(): void {
        this.getUserProfiles();
    }

    private initiateSearchConfigurations(): void {
        let status: NameValue<string>[] = [
            new NameValue<string>('Active', 'Active'),
            new NameValue<string>('InActive', 'InActive'),
        ]
        this.searchConfigs = [
            new SearchTextBox({
                Name: 'UserId',
                Description: 'User Id',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'Name',
                Description: 'Name',
                Value: ''
            }),
           new SearchTextBox({
                Name: 'Email',
                Description: 'Email',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'MainContact',
                Description: 'Main Contact',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'AlternateContact',
                Description: 'Alternate Contact',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'Location',
                Description: 'Location',
                Value: ''
            }),
            new SearchDropdown({
                Name: 'ActiveFlag',
                Description: 'Status',
                PlaceHolder: 'Select Status',
                Value: '',
                ListData: Observable.of(status)
            })
        ];
    }
}