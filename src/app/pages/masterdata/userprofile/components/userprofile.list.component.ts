import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { UserProfileService } from './userprofile.service';
import { UserProfileModel } from './userprofile.model';
import { InvalidUserProfileModel } from './invalid.userprofile.model'
import {
    ResponseModel, DataExchangeService, SearchConfigModel,
    SearchTextBox, SearchDropdown,
    NameValue,
    GlobalConstants
} from '../../../../shared';
import { Observable, Subject } from 'rxjs/Rx';
import { ModalDirective } from "ngx-bootstrap";

@Component({
    selector: 'userprofile-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/userprofile.list.view.html'
})
export class UserProfileListComponent implements OnInit, OnDestroy {
    userProfiles: UserProfileModel[] = [];
    invalidUserProfiles: InvalidUserProfileModel[] = [];
    searchConfigs: SearchConfigModel<any>[] = [];
    userProfilePatch: UserProfileModel = null;
    expandSearch: boolean = false;
    searchValue: string = "Expand Search";
    freezeColumnEnabled: boolean = true;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    @ViewChild('invalidUserProfileModal') public invalidUserProfileModal: ModalDirective;

    constructor(private userProfileService: UserProfileService,
        private dataExchange: DataExchangeService<UserProfileModel>) { }

    getUserProfiles(): void {
        this.userProfileService.GetAllUsers()
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<UserProfileModel>) => {
                this.userProfiles = response.Records;

                this.userProfiles.map((item: UserProfileModel) => {
                    item.isActive = (item.ActiveFlag == 'Active');
                });
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    getInvalidUserProfiles(callback: () => void = null): void {
        this.userProfileService.GetAllInvalidRecords()
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<InvalidUserProfileModel>) => {
                this.invalidUserProfiles = response.Records;
                if (callback != null)
                    callback();
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    onUserProfileSuccess(data: UserProfileModel): void {
        this.getUserProfiles();
    }

    UpdateUserProfile(userProfileModelUpdate: UserProfileModel): void {
        let userProfileModelToSend = Object.assign({}, userProfileModelUpdate)
        this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.UserProfileModelToBeModified, userProfileModelToSend);
    }

    expandSearchPanel(value): void {
        if (!value) {
            this.searchValue = "Hide Search Panel";
        }
        else {
            this.searchValue = "Expand Search Panel";
        }
        this.expandSearch = !this.expandSearch;
    }

    ngOnInit(): any {
        this.getUserProfiles();
        this.initiateSearchConfigurations();

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.UserProfileModelCreated,
            (model: UserProfileModel) => this.onUserProfileSuccess(model));

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.UserProfileModelModified,
            (model: UserProfileModel) => this.onUserProfileSuccess(model));

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.UserProfileLoadedFromFile,
            () => { this.getUserProfiles() });
    }

    trackByIndex(index) {
        return index;
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.UserProfileModelCreated);
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.UserProfileModelModified);
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.UserProfileLoadedFromFile);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    checkChange(event: any, editedUderProfile: UserProfileModel): void {
        this.userProfilePatch = new UserProfileModel();
        this.userProfilePatch.deleteAttributes();
        this.userProfilePatch.UserProfileId = editedUderProfile.UserProfileId;
        this.userProfilePatch.ActiveFlag = 'Active';
        this.userProfilePatch.isActive = true;
        if (!event.checked) {
            this.userProfilePatch.isActive = false;
            this.userProfilePatch.ActiveFlag = 'InActive';
        }
        this.userProfileService.Update(this.userProfilePatch)
            .subscribe((response: UserProfileModel) => {
                this.getUserProfiles();
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    checkChangeVolunteered(event: any, editedUderProfile: UserProfileModel): void {
        this.userProfilePatch = new UserProfileModel();
        this.userProfilePatch.deleteAttributes();
        this.userProfilePatch.UserProfileId = editedUderProfile.UserProfileId;
        this.userProfilePatch.isVolunteered = event.checked;

        this.userProfileService.Update(this.userProfilePatch)
            .subscribe((response: UserProfileModel) => {
                this.getUserProfiles();
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    invokeSearch(query: string): void {
        if (query !== '') {
            if (query.indexOf('isActive') >= 0) {
                if (query.indexOf("'true'") >= 0)
                    query = query.replace("'true'", "true");
                if (query.indexOf("'false'") >= 0)
                    query = query.replace("'false'", "false");
            }
            this.userProfileService.GetQuery(query)
                .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
                .takeUntil(this.ngUnsubscribe)
                .subscribe((response: ResponseModel<UserProfileModel>) => {
                    this.userProfiles = response.Records;
                }, ((error: any) => {
                    console.log(`Error: ${error.message}`);
                }));
        }
        else {
            this.getUserProfiles();
        }
    }

    invokeReset(): void {
        this.getUserProfiles();
    }

    openInvalidRecords(): void {
        let self = this;
        this.getInvalidUserProfiles(() => self.invalidUserProfileModal.show());
        // this.invalidUserProfileModal.show();
    }

    closeInvalidProfile(): void {
        this.invalidUserProfileModal.hide();
    }

    private initiateSearchConfigurations(): void {
        let status: NameValue<boolean>[] = [
            new NameValue<boolean>('Active', true),
            new NameValue<boolean>('In Active', false)
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
            // new SearchTextBox({
            //     Name: 'ContactNumber',
            //     Description: 'Contact',
            //     Value: '',
            //     OrCommand: 'MainContact|AlternateContact'
            // }),
            // new SearchTextBox({
            //     Name: 'AlternateContact',
            //     Description: 'Alternate Contact',
            //     Value: ''
            // }),
            // new SearchTextBox({
            //     Name: 'Location',
            //     Description: 'Location',
            //     Value: ''
            // }),
            new SearchDropdown({
                Name: 'isActive',
                Description: 'Status',
                PlaceHolder: 'Select Status',
                Value: '',
                ListData: Observable.of(status)
            })
        ];
    }
}