import {
    Component, ViewEncapsulation, Input,
    OnInit, OnDestroy
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators, ReactiveFormsModule
} from '@angular/forms';
import { Observable, Subject } from 'rxjs/Rx';
import {
    DataExchangeService, KeyValue,
    GlobalConstants, GlobalStateService
} from '../../../../shared';

import { MasterDataUploadForValidService } from '../masterdata.upload.valid.records.service'
import { CargoModel } from '../../../shared.components/'

@Component({
    selector: 'validCargo-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../views/valid/valid.cargo.list.view.html'
})
export class ValidCargoListComponent implements OnInit, OnDestroy {
    cargoes: CargoModel[] = []
    @Input() IncidentId: number;
    @Input() IsVisible: boolean;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private _validRecordService: MasterDataUploadForValidService,
        private dataExchange: DataExchangeService<CargoModel>,
        private globalState: GlobalStateService) { }

    ngOnInit(): void {
        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.OpenCargoes,
            (model: CargoModel) => this.OpenCargoes(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChange,
            (model: KeyValue) => this.incidentChangeHandler(model));
    }

    OpenCargoes(cargo: CargoModel): void {
        this.cargoes = [];
        this.getValidCargoRecords();
    }

    getValidCargoRecords(): void {
        this._validRecordService.GetAllCargoByIncidentId(this.IncidentId)
            .flatMap(x => x)
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe(a => {
                this.cargoes.push(a);
                console.log(this.cargoes);

            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            }, () => {
                this.cargoes.sort((a, b) => {
                    if (a.AWB < b.AWB) return -1;
                    if (a.AWB > b.AWB) return 1;
                    return 0;
                })
            });
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.OpenCargoes);
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChange);
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.IncidentId = incident.Value;
    };
}