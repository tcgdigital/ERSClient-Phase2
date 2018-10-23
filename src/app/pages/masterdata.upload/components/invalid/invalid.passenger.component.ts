import {
    Component, ViewEncapsulation, Input, OnInit, OnDestroy
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators, ReactiveFormsModule
} from '@angular/forms';
import { Subject, Observable } from 'rxjs/Rx';
import {
    DataExchangeService,
    GlobalConstants, GlobalStateService, KeyValue
} from '../../../../shared';

import { MasterDataUploadForInvalidService } from '../masterdata.upload.invalid.records.service'
import { InvalidPassengerModel } from '../../../shared.components/'

@Component({
    selector: 'invalidPassengers-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../views/invalid/invalid.passenger.view.html'
})
export class InvalidPassengersListComponent implements OnInit, OnDestroy {
    invalidPassengers: InvalidPassengerModel[] = []
    @Input() IncidentId: number;
    @Input() IsVisible: boolean;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private _invalidRecordService: MasterDataUploadForInvalidService,
        private dataExchange: DataExchangeService<InvalidPassengerModel>,
        private globalState: GlobalStateService) { }

    ngOnInit(): void {
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChange,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.OpenInvalidPassengers,
            (model: InvalidPassengerModel) => this.openInvalidPassengers(model));
    }

    openInvalidPassengers(invalidPassenger: InvalidPassengerModel): void {
        this.invalidPassengers = [];
        this.getInvalidPassengerRecords();
    }

    ngOnDestroy(): void {
        //this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.OpenInvalidPassengers);
        //this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChange);
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    getInvalidPassengerRecords(): void {
        this.invalidPassengers = [];
        this._invalidRecordService.GetAllInvalidPassengersByIncident(this.IncidentId)
            .flatMap(x => x)
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe(a => {
                this.invalidPassengers.push(a);
                this.invalidPassengers.sort((a, b) => {
                    if (a.PassengerName < b.PassengerName) return -1;
                    if (a.PassengerName > b.PassengerName) return 1;

                    return 0;
                })
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.IncidentId = incident.Value;
    };
}



