import {
    Component, ViewEncapsulation, Input, OnInit, OnDestroy
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators, ReactiveFormsModule
} from '@angular/forms';
import { Subject } from 'rxjs/Rx';
import {
    DataExchangeService, KeyValue,
    GlobalConstants, GlobalStateService
} from '../../../../shared';

import { MasterDataUploadForInvalidService } from '../masterdata.upload.invalid.records.service'
import { InvalidGroundVictimModel } from '../../../shared.components/'


@Component({
    selector: 'invalidGroundVictim-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../views/invalid/invalid.ground.victim.view.html'
})
export class InvalidGroundVictimListComponent implements OnInit, OnDestroy {
    invalidGroundVictims: InvalidGroundVictimModel[] = [];
    @Input() IncidentId: number;
    @Input() IsVisible: boolean;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private _invalidRecordService: MasterDataUploadForInvalidService,
        private dataExchange: DataExchangeService<InvalidGroundVictimModel>,
        private globalState: GlobalStateService) { }

    ngOnInit(): void {
        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.OpenInvalidGroundVictims,
            (model: InvalidGroundVictimModel) => this.OpenInvalidGroundVictims(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChange,
            (model: KeyValue) => this.incidentChangeHandler(model));
    }


    getInvalidGroundVictims(): void {
        this._invalidRecordService.GetAllInvalidGroundVictimsByIncidentId(this.IncidentId)
            .flatMap(x => x)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(a => {
                this.invalidGroundVictims.push(a);
                this.invalidGroundVictims.sort((a, b) => {
                    if (a.InvalidGroundVictimName < b.InvalidGroundVictimName) return -1;
                    if (a.InvalidGroundVictimName > b.InvalidGroundVictimName) return 1;
                    return 0;
                })
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    OpenInvalidGroundVictims(groundVictim: InvalidGroundVictimModel): void {
        this.invalidGroundVictims = [];
        this.getInvalidGroundVictims();
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.OpenInvalidGroundVictims);
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChange);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.IncidentId = incident.Value;
    }
}