import { Component, ViewEncapsulation, OnInit, OnDestroy, ViewChild } from '@angular/core';

import {
    GlobalStateService, ResponseModel, SearchConfigModel,
    SearchTextBox,
    GlobalConstants
} from '../../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UserProfileService } from '../../masterdata/userprofile/components/userprofile.service';
import { UserProfileModel } from '../../masterdata/userprofile/components';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'contactinfo',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './contact.info.view.html',
    providers: [UserProfileService]
})
export class ContactInfoComponent implements OnInit, OnDestroy {
    @ViewChild('childModal') public childModal: ModalDirective;

    userprofiles: UserProfileModel[] = [];
    searchConfigs: SearchConfigModel<any>[] = [];
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     *Creates an instance of ContactInfoComponent.
     * @param {GlobalStateService} globalState
     * @param {UserProfileService} userprofileService
     * @memberof ContactInfoComponent
     */
    constructor(private globalState: GlobalStateService,
        private userprofileService: UserProfileService) {
    }

    ngOnInit(): any {
        this.initiateSearchConfigurations();
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.ContactClicked,
            (model) => this.contactClicked());
    }

    ngOnDestroy() {
        //this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.ContactClicked);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    contactClicked(): void {
        this.userprofileService.GetForDirectory()
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<UserProfileModel>) => {
                this.userprofiles = response.Records;
                this.childModal.show();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    cancelModal(): void {
        this.childModal.hide();
    }

    invokeSearch(query: string): void {
        if (query !== '') {
            this.userprofileService.GetQuery(query)
                .takeUntil(this.ngUnsubscribe)
                .subscribe((response: ResponseModel<UserProfileModel>) => {
                    this.userprofiles = response.Records;
                }, ((error: any) => {
                    console.log(`Error: ${error}`);
                }));
        }
    }

    invokeReset(): void {
        this.userprofileService.GetForDirectory()
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<UserProfileModel>) => {
                this.userprofiles = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    private initiateSearchConfigurations(): void {

        this.searchConfigs = [
            new SearchTextBox({
                Name: 'Name',
                Description: 'Name',
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
            })
        ];
    }
}