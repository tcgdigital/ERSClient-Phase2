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

import { MasterDataUploadForValidService } from '../masterdata.upload.valid.records.service'
import { GroundVictimModel } from '../../../shared.components/'

@Component({
    selector: 'validGroundVictim-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../views/valid/valid.ground.victim.list.view.html'
})

export class ValidGroundVictimListComponent implements OnInit, OnDestroy {
    groundVictims: GroundVictimModel[] = [];
    @Input() IncidentId: number;
    @Input() IsVisible: boolean;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private _validRecordService: MasterDataUploadForValidService,
        private dataExchange: DataExchangeService<GroundVictimModel>,
        private globalState: GlobalStateService) { }

    ngOnInit(): void {
        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.OpenGroundVictims,
            (model: GroundVictimModel) => this.OpenGroundVictims(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChange,
            (model: KeyValue) => this.incidentChangeHandler(model));
    }

    getValidGroundVictims(): void {
        this._validRecordService.GetAllGroundVictimsByIncidentId(this.IncidentId)
            .takeUntil(this.ngUnsubscribe)
            .flatMap(x => x)
            .subscribe(a => {
                this.groundVictims.push(a);
                this.groundVictims.sort((a, b) => {
                    if (a.GroundVictimName < b.GroundVictimName) return -1;
                    if (a.GroundVictimName > b.GroundVictimName) return 1;
                    return 0;
                })
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    OpenGroundVictims(groundVictim: GroundVictimModel): void {
        this.groundVictims = [];
        this.getValidGroundVictims();
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.OpenGroundVictims);
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChange);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.IncidentId = incident.Value;
    }
}