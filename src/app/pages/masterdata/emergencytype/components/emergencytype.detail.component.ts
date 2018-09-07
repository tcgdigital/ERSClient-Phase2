import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { EmergencyTypeModel } from './emergencytype.model';
import { EmergencyTypeService } from './emergencytype.service';
import { Observable, Subject } from 'rxjs/Rx';

import {
    ResponseModel, DataExchangeService, SearchConfigModel,
    SearchTextBox, SearchDropdown,
    NameValue,
    GlobalConstants
} from '../../../../shared';

@Component({
    selector: 'emergencytype-detail',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/emergencytype.detail.view.html'
})
export class EmergencyTypeDetailComponent implements OnInit, OnDestroy {
    emergencyTypes: EmergencyTypeModel[] = [];
    searchConfigs: SearchConfigModel<any>[] = [];
    emergencyTypePatch: EmergencyTypeModel = null;
    expandSearch: boolean = false;
    searchValue: string = "Expand Search";
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     * Creates an instance of EmergencyTypeDetailComponent.
     * @param {EmergencyTypeService} emergencyTypeService 
     * @param {DataExchangeService<EmergencyTypeModel>} dataExchange 
     * 
     * @memberOf EmergencyTypeDetailComponent
     */
    constructor(private emergencyTypeService: EmergencyTypeService,
        private dataExchange: DataExchangeService<EmergencyTypeModel>) { }

    /**
     * Get all emergency types
     * 
     * @memberOf EmergencyTypeDetailComponent
     */
    getEmergencyTypes(): void {
        this.emergencyTypeService.GetAll()
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<EmergencyTypeModel>) => {
                this.emergencyTypes = response.Records;
                this.emergencyTypes.forEach(x => {
                    x["Active"] = (x.ActiveFlag == 'Active');
                });
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    onSuccess(data: EmergencyTypeModel): void {
        this.getEmergencyTypes();
    }

    UpdateEmergencyType(emergencyTypeModelUpdate: EmergencyTypeModel): void {
        let emergencyModelToSend = Object.assign({}, emergencyTypeModelUpdate)
        this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.OnEmergencyTypeUpdate, emergencyModelToSend);
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
        this.getEmergencyTypes();
        this.initiateSearchConfigurations();

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.EmergencyTypeModelSaved, 
            (model: EmergencyTypeModel) => this.onSuccess(model));

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.EmergencyTypeModelUpdated, 
            (model: EmergencyTypeModel) => this.onSuccess(model))
    }

    /**
     * Destroy all subscription
     * 
     * @memberOf EmergencyTypeDetailComponent
     */
    ngOnDestroy(): void {
        //this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.OnEmergencyTypeUpdate);
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.EmergencyTypeModelSaved);
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.EmergencyTypeModelUpdated);

        this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
    }

    IsActive(event: any, editedEmergencyType: EmergencyTypeModel): void {
        this.emergencyTypePatch = new EmergencyTypeModel();
        this.emergencyTypePatch.EmergencyTypeId = editedEmergencyType.EmergencyTypeId;
        this.emergencyTypePatch.deleteAttributes();
        this.emergencyTypePatch.ActiveFlag = 'Active';
        if (!event.checked) {
            this.emergencyTypePatch.ActiveFlag = 'InActive';
        }
        this.emergencyTypeService.Update(this.emergencyTypePatch)
            .subscribe((response: EmergencyTypeModel) => {
                this.getEmergencyTypes();
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }


    private initiateSearchConfigurations(): void {
        let status: NameValue<string>[] = [
            new NameValue<string>('Active', 'Active'),
            new NameValue<string>('InActive', 'InActive'),
        ]

        let emergencyCategories: NameValue<string>[] = [
            new NameValue<string>('Flight Related', 'FlightRelated'),
            new NameValue<string>('NonFlight Related', 'NonFlightRelated'),
        ]

        this.searchConfigs = [
            new SearchTextBox({
                Name: 'EmergencyTypeName',
                Description: 'Crisis Type',
                Value: ''
            }),
            new SearchDropdown({
                Name: 'EmergencyCategory',
                Description: 'Crisis Category',
                PlaceHolder: 'Select Status',
                Value: '',
                ListData: Observable.of(emergencyCategories)
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
    invokeSearch(query: string): void {
        if (query !== '') {
            this.emergencyTypeService.GetQuery(query)
                .takeUntil(this.ngUnsubscribe)
                .subscribe((response: ResponseModel<EmergencyTypeModel>) => {
                    this.emergencyTypes = response.Records;
                }, ((error: any) => {
                    console.log(`Error: ${error.message}`);
                }));
        }
        else {
            this.getEmergencyTypes();
        }
    }

    invokeReset(): void {
        this.getEmergencyTypes();
    }
}