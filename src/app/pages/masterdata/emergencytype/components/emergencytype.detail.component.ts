import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { EmergencyTypeModel } from './emergencytype.model';
import { EmergencyTypeService } from './emergencytype.service';
import { Observable } from 'rxjs/Rx';

import {
    ResponseModel, DataExchangeService, SearchConfigModel,
    SearchTextBox, SearchDropdown,
    NameValue
} from '../../../../shared';
import { ReactiveFormsModule } from '@angular/forms';

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
            .subscribe((response: ResponseModel<EmergencyTypeModel>) => {
                this.emergencyTypes = response.Records;
                this.emergencyTypes.forEach(x => {
                    x["Active"] = (x.ActiveFlag == 'Active');
                });
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    onSuccess(data: EmergencyTypeModel): void {
        this.getEmergencyTypes();
    }

    UpdateEmergencyType(emergencyTypeModelUpdate: EmergencyTypeModel): void {
        let emergencyModelToSend = Object.assign({}, emergencyTypeModelUpdate)
        this.dataExchange.Publish("OnEmergencyTypeUpdate", emergencyModelToSend);
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
        this.dataExchange.Subscribe('EmergencyTypeModelSaved', model => this.onSuccess(model));
        this.dataExchange.Subscribe('EmergencyTypeModelUpdated', model => this.onSuccess(model))
    }

    /**
     * Destroy all subscription
     * 
     * @memberOf EmergencyTypeDetailComponent
     */
    ngOnDestroy(): void {
        //this.dataExchange.Unsubscribe('OnEmergencyTypeUpdate');
        this.dataExchange.Unsubscribe('EmergencyTypeModelSaved');
        this.dataExchange.Unsubscribe('EmergencyTypeModelUpdated');
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
                console.log(`Error: ${error}`);
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
                .subscribe((response: ResponseModel<EmergencyTypeModel>) => {
                    this.emergencyTypes = response.Records;
                }, ((error: any) => {
                    console.log(`Error: ${error}`);
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