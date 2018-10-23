import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import { DemandTypeModel } from './demandtype.model';
import { DemandTypeService } from './demandtype.service';
import {
    ResponseModel, DataExchangeService, SearchConfigModel,
    SearchTextBox, SearchDropdown, NameValue, GlobalConstants
} from '../../../../shared';

@Component({
    selector: 'demandtype-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/demandtype.list.view.html',
    styleUrls: ['../styles/demandtype.style.scss']
})
export class DemandTypeListComponent implements OnInit, OnDestroy {
    demandTypes: DemandTypeModel[] = [];
    demandTypeModelToUpdate: DemandTypeModel = new DemandTypeModel();
    searchConfigs: Array<SearchConfigModel<any>> = new Array<SearchConfigModel<any>>();
    expandSearch: boolean = false;
    searchValue: string = "Expand Search";
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     *Creates an instance of DemandTypeListComponent.
     * @param {DemandTypeService} demandTypeService
     * @param {DataExchangeService<DemandTypeModel>} dataExchange
     * @memberof DemandTypeListComponent
     */
    constructor(private demandTypeService: DemandTypeService,
        private dataExchange: DataExchangeService<DemandTypeModel>) { }

    getDemandTypes(): void {
        this.demandTypeService.GetAll()
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<DemandTypeModel>) => {

                this.demandTypes = response.Records;
                this.demandTypes.forEach((x) => {
                    x['Active'] = (x.ActiveFlag === 'Active');
                });
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    IsActive(event: any, editedDemandType: DemandTypeModel): void {
        this.demandTypeModelToUpdate.deleteAttributes();
        this.demandTypeModelToUpdate.DemandTypeId = editedDemandType.DemandTypeId;
        this.demandTypeModelToUpdate.ActiveFlag = 'Active';
        if (!event.checked) {
            this.demandTypeModelToUpdate.ActiveFlag = 'InActive';
        }
        this.demandTypeService.Update(this.demandTypeModelToUpdate)
            .subscribe((response: DemandTypeModel) => {
                this.getDemandTypes();
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    onDemandSuccess(data: DemandTypeModel): void {
        this.getDemandTypes();
    }

    edit(demandTypeModelToUpdate: DemandTypeModel): void {
        const demandTypeModelToSend = Object.assign({}, demandTypeModelToUpdate);
        this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.OnDemandUpdate, demandTypeModelToSend);
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
        this.getDemandTypes();
        this.initiateSearchConfigurations();

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.DemandTypeModelSaved,
            (model: DemandTypeModel) => this.onDemandSuccess(model));

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.DemandTypeModelUpdated,
            (model: DemandTypeModel) => this.onDemandSuccess(model));
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.DemandTypeModelUpdated);
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.DemandTypeModelSaved);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    invokeSearch(query: string): void {
        if (query !== '') {
            if (query.indexOf('IsAutoApproved') >= 0) {
                if (query.indexOf("'true'") >= 0)
                    query = query.replace("'true'", 'true');
                if (query.indexOf("'false'") >= 0)
                    query = query.replace("'false'", 'false');
            }
            this.demandTypeService.GetQuery(query)
                // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
                .takeUntil(this.ngUnsubscribe)
                .subscribe((response: ResponseModel<DemandTypeModel>) => {
                    this.demandTypes = response.Records;
                    this.demandTypes.forEach((x) => {
                        x['Active'] = (x.ActiveFlag === 'Active');
                    });
                }, ((error: any) => {
                    console.log(`Error: ${error.message}`);
                }));
        }
        else {
            this.getDemandTypes();
        }
    }

    invokeReset(): void {
        this.getDemandTypes();
    }

    private initiateSearchConfigurations(): void {
        const status: Array<NameValue<string>> = [
            new NameValue<string>('Active', 'Active'),
            new NameValue<string>('InActive', 'InActive')
        ] as Array<NameValue<string>>;

        const autoApproved: Array<NameValue<boolean>> = [
            new NameValue<boolean>('Yes', true),
            new NameValue<boolean>('No', false)
        ] as Array<NameValue<boolean>>;

        this.searchConfigs = [
            new SearchTextBox({
                Name: 'DemandTypeName',
                Description: 'Demand Type',
                Value: ''
            }),
            new SearchDropdown({
                Name: 'IsAutoApproved',
                Description: 'Auto Approve',
                PlaceHolder: 'Auto Approve',
                Value: '',
                ListData: Observable.of(autoApproved)
            }),
            new SearchDropdown({
                Name: 'ApproverDepartment/DepartmentId',
                Description: 'Approver Department',
                PlaceHolder: 'Select Approver Department',
                Value: '',
                ListData: this.demandTypeService.GetAllApproverDepartment().map((x) => x)
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