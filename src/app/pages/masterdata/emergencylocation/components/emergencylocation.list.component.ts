import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { EmergencyLocationService } from './emergencylocation.service';
import { EmergencyLocationModel } from './emergencylocation.model';
import {
    ResponseModel, DataExchangeService, SearchConfigModel,
    SearchTextBox, SearchDropdown,
    NameValue
} from '../../../../shared';
import { Observable } from 'rxjs/Rx';


@Component({
    selector: 'emergencylocation-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/emergencylocation.list.view.html'
})
export class EmergencyLocationListComponent implements OnInit, OnDestroy {
    emergencyLocations: EmergencyLocationModel[] = [];
    searchConfigs: SearchConfigModel<any>[] = [];
    emergencyLocationPatch : EmergencyLocationModel = null;

    constructor(private emergencyLocationService: EmergencyLocationService,
        private dataExchange: DataExchangeService<EmergencyLocationModel>) {  }

    ngOnInit(): void{
        this.getAllEmergencyLocations();
    }

    ngOnDestroy():void {}

    getAllEmergencyLocations(): void{
        this.emergencyLocationService.GetAll()
        .subscribe((response: ResponseModel<EmergencyLocationModel>) => {
            debugger;
            this.emergencyLocations = response.Records;
            console.log(this.emergencyLocations);
        });
    }
}