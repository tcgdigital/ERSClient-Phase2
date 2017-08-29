import {
    Component, ViewEncapsulation, Input, OnChanges, SimpleChange,
    OnInit, OnDestroy, AfterContentInit, ViewChild
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators, ReactiveFormsModule
} from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import {
    ResponseModel, DataExchangeService,
    UtilityService, GlobalConstants, KeyValue, GlobalStateService
} from '../../../../shared';

import { MasterDataUploadForInvalidService } from '../masterdata.upload.invalid.records.service';
import { InvalidCargoModel } from '../../../shared.components/';

@Component({
    selector: 'invalidCargo-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../views/invalid/invalid.cargo.view.html'
})

export class InvalidCargoListComponent implements OnInit, OnDestroy {
    invalidCargoes: InvalidCargoModel[] = [];
    @Input() IncidentId: number;
    @Input() IsVisible: boolean;

    constructor(private _invalidRecordService: MasterDataUploadForInvalidService,
        private dataExchange: DataExchangeService<InvalidCargoModel>,
        private globalState: GlobalStateService) { }

    ngOnInit(): void {
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.dataExchange.Subscribe('OpenInvalidCargoes', (model) => this.OpenInvalidCargoes(model));
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('OpenInvalidCargoes');
        // this.globalState.Unsubscribe('incidentChange');
    }

    OpenInvalidCargoes(invalidCargo: InvalidCargoModel) {
        this.invalidCargoes = [];
        this.getInvalidCargoRecords();
    }

    getInvalidCargoRecords(): void {
        this._invalidRecordService.GetAllInvalidCargosByIncident(+this.IncidentId)
            .flatMap(x => x)
            .subscribe(a => {
                this.invalidCargoes.push(a);
                this.invalidCargoes.sort((a, b) => {
                    if (a.AWB < b.AWB) return -1;
                    if (a.AWB > b.AWB) return 1;
                    // if (a.POL < b.POL) return -1;
                    // if (a.POL > b.POL) return 1;
                    return 0;
                })
            }),
            (error: any) => {
                console.log(`Error: ${error}`);
            };
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.IncidentId = incident.Value;
    }
}



