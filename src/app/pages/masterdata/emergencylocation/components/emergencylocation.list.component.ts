import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { EmergencyLocationService } from './emergencylocation.service';
import { EmergencyLocationModel } from './emergencylocation.model';
import {
    ResponseModel, DataExchangeService, SearchConfigModel,
    SearchTextBox, SearchDropdown,
    NameValue,
} from '../../../../shared';
import { Observable } from 'rxjs/Rx';
import { ToastrService, ToastrConfig } from 'ngx-toastr';


@Component({
    selector: 'emergencylocation-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/emergencylocation.list.view.html'
})
export class EmergencyLocationListComponent implements OnInit, OnDestroy {
    emergencyLocations: EmergencyLocationModel[] = [];
    searchConfigs: SearchConfigModel<any>[] = [];
    emergencyLocationPatch: EmergencyLocationModel = null;
    expandSearch: boolean = false;
    searchValue: string = "Expand Search";

    constructor(private emergencyLocationService: EmergencyLocationService,
        private dataExchange: DataExchangeService<EmergencyLocationModel>,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) { }

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
        this.getAllEmergencyLocations();
        this.initiateSearchConfigurations();
        this.dataExchange.Subscribe("EmergencyLocationModelSaved", model => {
            this.emergencyLocations.unshift(model);
        });

        this.dataExchange.Subscribe("EmergencyLocationModelUpdated", model => {
            this.getAllEmergencyLocations();
        });

        this.dataExchange.Subscribe("FileUploadedSuccessfully", () => {
            this.getAllEmergencyLocations();
        });
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("FileUploadedSuccessfully");
        this.dataExchange.Unsubscribe("EmergencyLocationModelSaved");
        this.dataExchange.Unsubscribe("EmergencyLocationModelUpdated");
    }

    getAllEmergencyLocations(): void {
        this.emergencyLocationService.GetAllEmergencyLocations()
            .subscribe((response: ResponseModel<EmergencyLocationModel>) => {
                this.emergencyLocations = response.Records;
                this.emergencyLocations.forEach(x => {
                    x.Active = (x.ActiveFlag === 'Active');
                })
                console.log(this.emergencyLocations);
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
            this.emergencyLocationService.GetQuery(query)
                .subscribe((response: ResponseModel<EmergencyLocationModel>) => {
                    this.emergencyLocations = response.Records;
                }, ((error: any) => {
                    console.log(`Error: ${error}`);
                }));
        }
        else {
            this.getAllEmergencyLocations();
        }
    }

    IsActive(event: any, editedEmergencyLocation: EmergencyLocationModel): void {
        delete editedEmergencyLocation.Active;
        this.emergencyLocationPatch = new EmergencyLocationModel();
        //this.emergencyLocationPatch.deleteAttributes();
        this.emergencyLocationPatch = editedEmergencyLocation;

        if (event.checked)
            this.emergencyLocationPatch.ActiveFlag = 'Active';
        else
            this.emergencyLocationPatch.ActiveFlag = 'InActive'
        this.emergencyLocationService.Update(this.emergencyLocationPatch)
            .subscribe((response: EmergencyLocationModel) => {
                this.getAllEmergencyLocations();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    deleteStation(emergencyLocation: EmergencyLocationModel): void {
        delete emergencyLocation.Active;
        if (confirm("Do you want to delete station: " + emergencyLocation.IATA + "?")) {
            let IATA = emergencyLocation.IATA;
            this.emergencyLocationService.Delete(emergencyLocation.EmergencyLocationId, emergencyLocation)
                .subscribe((response: any) => {
                    this.toastrService.success("Station: " + IATA + " is deleted successfully", "Success", this.toastrConfig);
                    this.getAllEmergencyLocations();
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
    }

    invokeReset(): void {
        this.getAllEmergencyLocations();
    }

    UpdateEmergencyLocation(emergencyLocationModelUpdate: EmergencyLocationModel) {
        let emergencyModelToSend = Object.assign({}, emergencyLocationModelUpdate)
        this.dataExchange.Publish("OnEmergencyLocationUpdate", emergencyModelToSend);
    }

    private initiateSearchConfigurations(): void {
        let status: NameValue<string>[] = [
            new NameValue<string>('Active', "Active"),
            new NameValue<string>('InActive', "InActive")
        ]
        this.searchConfigs = [
            new SearchTextBox({
                Name: 'IATA',
                Description: 'IATA Station Code',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'AirportName',
                Description: 'Airport Name',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'City',
                Description: 'City',
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