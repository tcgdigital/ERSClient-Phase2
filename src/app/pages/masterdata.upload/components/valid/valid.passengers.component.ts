import {
    Component, ViewEncapsulation, Input, OnInit, OnDestroy
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators, ReactiveFormsModule
} from '@angular/forms';
import { Subject } from 'rxjs/Rx';
import {
    DataExchangeService, GlobalConstants, KeyValue, GlobalStateService
} from '../../../../shared';

import { MasterDataUploadForValidService } from '../masterdata.upload.valid.records.service'
import { PassengerModel } from '../../../shared.components/'

@Component({
    selector: 'validPassengers-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../views/valid/valid.passenger.list.view.html'
})
export class ValidPassengersListComponent implements OnInit, OnDestroy {
    passengers: PassengerModel[] = []
    @Input() IncidentId: number;
    @Input() IsVisible: boolean;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private _validRecordService: MasterDataUploadForValidService,
        private dataExchange: DataExchangeService<PassengerModel>,
        private globalState: GlobalStateService) { }

    ngOnInit(): void {
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChange,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.dataExchange.Subscribe("OpenPassengers",
            (model: PassengerModel) => this.OpenPassengers(model));
    }

    OpenPassengers(passenger: PassengerModel): void {
        this.passengers = [];
        this.getValidPassengerRecords();
    }

    getValidPassengerRecords(): void {
        this._validRecordService.GetAllPassengerByIncidentId(this.IncidentId)
            .flatMap(x => x)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(a => {
                this.passengers.push(a.Passenger);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.OpenPassengers);
        //this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChange);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.IncidentId = incident.Value;
    }
}



