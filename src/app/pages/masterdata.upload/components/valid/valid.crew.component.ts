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
import { CrewModel } from '../../../shared.components/'

@Component({
    selector: 'validCrew-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../views/valid/valid.crew.list.view.html'
})
export class ValidCrewListComponent implements OnInit, OnDestroy {
    crews: CrewModel[] = []
    @Input() IncidentId: number;
    @Input() IsVisible: boolean;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     *Creates an instance of ValidCrewListComponent.
     * @param {MasterDataUploadForValidService} _validRecordService
     * @param {DataExchangeService<CrewModel>} dataExchange
     * @param {GlobalStateService} globalState
     * @memberof ValidCrewListComponent
     */
    constructor(private _validRecordService: MasterDataUploadForValidService,
        private dataExchange: DataExchangeService<CrewModel>,
        private globalState: GlobalStateService) { }

    ngOnInit(): void {
        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.OpenCrews,
            (model: CrewModel) => this.OpenCrews(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChange,
            (model: KeyValue) => this.incidentChangeHandler(model));
    }

    OpenCrews(Crew: CrewModel): void {
        this.crews = [];
        this.getValidCrewRecords();
    }

    getValidCrewRecords(): void {
        this._validRecordService.GetAllCrewByIncidentId(this.IncidentId)
            .flatMap(x => x)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(a => {
                this.crews.push(a.Crew);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });

        console.log(this.crews);
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.OpenCrews);
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChange);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.IncidentId = incident.Value;
    }
}