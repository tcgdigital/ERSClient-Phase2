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
    ResponseModel, DataExchangeService, KeyValue,
    UtilityService, GlobalConstants,GlobalStateService
} from '../../../../shared';

import { MasterDataUploadForValidService } from '../masterdata.upload.valid.records.service'
import { InvolvePartyModel, CargoModel } from '../../../shared.components/'

@Component({
    selector: 'validCargo-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../views/valid/valid.cargo.list.view.html'
})

export class ValidCargoListComponent implements OnInit, OnDestroy {

    cargoes: CargoModel[] = []
    @Input() IncidentId: number;
    @Input() IsVisible: boolean;

    constructor(private _validRecordService: MasterDataUploadForValidService,
        private dataExchange: DataExchangeService<CargoModel>,
        private globalState: GlobalStateService) { }

    ngOnInit(): void {
        this.dataExchange.Subscribe("OpenCargoes", model => this.OpenCargoes(model));
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model)); 
    }

    // public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    //     if (changes['IncidentId'].currentValue !==
    //         changes['IncidentId'].previousValue) {
    //             this.dataExchange.Subscribe("OpenCargoes", model => this.OpenCargoes(model));
    //         }
    // }

    OpenCargoes(cargo: CargoModel): void {
        this.cargoes = [];
        this.getValidCargoRecords();
    }

    getValidCargoRecords(): void {
        this._validRecordService.GetAllCargoByIncidentId(this.IncidentId)
            .flatMap(x => x)
            .subscribe(a => {
                this.cargoes.push(a);
                console.log(this.cargoes);
            }),
            (error: any) => {
                console.log(`Error: ${error}`);
            };
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("OpenCargoes");
        this.dataExchange.Unsubscribe("incidentChange");
    }

     private incidentChangeHandler(incident: KeyValue): void {
        this.IncidentId = incident.Value;        
    };  
}



