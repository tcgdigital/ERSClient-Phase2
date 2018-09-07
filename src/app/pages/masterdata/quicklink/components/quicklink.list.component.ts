import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { QuickLinkModel } from './quicklink.model';
import { QuickLinkService } from './quicklink.service';
import { Observable, Subject } from 'rxjs/Rx';


import {
    ResponseModel, DataExchangeService, SearchConfigModel,
    SearchTextBox, NameValue, SearchDropdown, GlobalConstants
} from '../../../../shared';

@Component({
    selector: 'quicklink-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/quicklink.list.view.html',
    styleUrls: ['../styles/quicklink.style.scss']
})
export class QuickLinkListComponent implements OnInit, OnDestroy {
    vari: any = null;
    quicklinks: QuickLinkModel[] = [];
    quickLinkModelPatch: QuickLinkModel = null;
    date: Date = new Date();
    searchConfigs: SearchConfigModel<any>[] = [];
    expandSearch: boolean = false;
    searchValue: string = "Expand Search";
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private quicklinkService: QuickLinkService,
        private dataExchange: DataExchangeService<QuickLinkModel>) { }

    initiateQuickLinkModelPatch(): void {
        this.quickLinkModelPatch = new QuickLinkModel();
        this.quickLinkModelPatch.ActiveFlag = 'Active';
        this.quickLinkModelPatch.CreatedBy = 1;
        this.quickLinkModelPatch.CreatedOn = this.date;
    }

    getQuickLinks(): void {
        this.quicklinkService.GetAll()
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<QuickLinkModel>) => {
                this.quicklinks = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    onQuickLinkSaveSuccess(data: QuickLinkModel): void {
        this.quicklinks.unshift(data);
    }

    onQuickLinkModifiedSuccess(data: QuickLinkModel): void {
        let modifiedPosition = this.quicklinks.findIndex(x => x.QuickLinkId == data.QuickLinkId);
        let currentData = this.quicklinks.find(x => x.QuickLinkId == data.QuickLinkId);
        if (modifiedPosition > -1 && currentData) {
            currentData.QuickLinkGroup = data.QuickLinkGroup;
            this.quicklinks.splice(modifiedPosition, 1, currentData);
        }
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

    ngOnInit(): void {
        this.getQuickLinks();
        this.initiateSearchConfigurations();

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.QuickLinkModelSaved,
            (model: QuickLinkModel) => this.onQuickLinkSaveSuccess(model));

        //quickLinkModelEdited
        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.QuickLinkModelModified,
            (model: QuickLinkModel) => this.onQuickLinkModifiedSuccess(model));
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.QuickLinkModelSaved);
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    editQuickLink(editedQuickLink: QuickLinkModel): void {
        this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.QuickLinkModelEdited, editedQuickLink);
    }

    delQuickLink(quickLinkId: number, quickLink: QuickLinkModel): void {
        this.quicklinkService.Delete(quickLinkId, quickLink)
            .subscribe((response: QuickLinkModel) => {
                this.getQuickLinks();
            });
    }

    IsActive(event: any, editedQuickLink: QuickLinkModel): void {
        this.initiateQuickLinkModelPatch();
        this.quickLinkModelPatch.QuickLinkId = editedQuickLink.QuickLinkId;
        this.quickLinkModelPatch.ActiveFlag = 'Active';
        if (!event.checked) {
            this.quickLinkModelPatch.ActiveFlag = 'InActive';
        }
        this.quicklinkService.Update(this.quickLinkModelPatch)
            .subscribe((response: QuickLinkModel) => {
                this.getQuickLinks();
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    private initiateSearchConfigurations(): void {
        let status: NameValue<string>[] = [
            new NameValue<string>('Active', 'Active'),
            new NameValue<string>('InActive', 'InActive'),
        ]
        this.searchConfigs = [
            new SearchTextBox({
                Name: 'QuickLinkName',
                Description: 'QuickLink Name',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'QuickLinkURL',
                Description: 'QuickLink URL',
                Value: ''
            })
        ];
    }

    invokeSearch(query: string): void {
        if (query !== '') {
            this.quicklinkService.GetQuery(query)
                .takeUntil(this.ngUnsubscribe)
                .subscribe((response: ResponseModel<QuickLinkModel>) => {
                    this.quicklinks = response.Records;
                }, ((error: any) => {
                    console.log(`Error: ${error.message}`);
                }));
        }
        else {
            this.getQuickLinks();
        }
    }

    invokeReset(): void {
        this.getQuickLinks();
    }
}