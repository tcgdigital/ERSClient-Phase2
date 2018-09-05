import {
    Component, ViewEncapsulation, Input, OnInit, OnDestroy
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators, ReactiveFormsModule
} from '@angular/forms';
import { Subject } from 'rxjs/Rx';
import {
    DataExchangeService, GlobalConstants, GlobalStateService, KeyValue
} from '../../../../shared';

import { MasterDataUploadForInvalidService } from '../masterdata.upload.invalid.records.service'
import { InvalidCrewModel } from '../../../shared.components/'

@Component({
    selector: 'invalidCrew-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../views/invalid/invalid.crew.view.html'
})

export class InvalidCrewListComponent implements OnInit, OnDestroy {
    invalidCrews: InvalidCrewModel[] = []
    @Input() IncidentId: number;
    @Input() IsVisible: boolean;

    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private _invalidRecordService: MasterDataUploadForInvalidService,
        private dataExchange: DataExchangeService<InvalidCrewModel>,
        private globalState: GlobalStateService) {
    }

    ngOnInit(): void {
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChange,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.OpenInvalidCrews,
            (model: InvalidCrewModel) => this.openInvalidCrews(model));
    }

    ngOnDestroy(): void {
        //this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.OpenInvalidCrews);
        //this.globalState.Unsubscribe("incidentChange");

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    openInvalidCrews(invalidCrew: InvalidCrewModel): void {
        this.invalidCrews = [];
        this.getInvalidCrewRecords();
    }

    getInvalidCrewRecords(): void {
        this._invalidRecordService.GetAllInvalidCrewsByIncident(+this.IncidentId)
            .flatMap(x => x)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(a => {
                this.invalidCrews.push(a);
                this.invalidCrews.sort((a, b) => {
                    if (a.CrewName < b.CrewName) return -1;
                    if (a.CrewName > b.CrewName) return 1;
                    return 0;
                })
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.IncidentId = incident.Value;
    };
}