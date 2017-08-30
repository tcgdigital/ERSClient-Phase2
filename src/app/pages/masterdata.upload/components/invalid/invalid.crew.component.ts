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
    UtilityService, GlobalConstants, GlobalStateService, KeyValue
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

    constructor(private _invalidRecordService: MasterDataUploadForInvalidService,
        private dataExchange: DataExchangeService<InvalidCrewModel>,
        private globalState: GlobalStateService) {
    }

    ngOnInit(): void {
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.dataExchange.Subscribe("OpenInvalidCrews", model => this.openInvalidCrews(model));
    }



    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("OpenInvalidCrews");
        this.globalState.Unsubscribe("incidentChange");
    }

    openInvalidCrews(invalidCrew: InvalidCrewModel): void {
        this.invalidCrews = [];
        this.getInvalidCrewRecords();
    }

    getInvalidCrewRecords(): void {
        this._invalidRecordService.GetAllInvalidCrewsByIncident(+this.IncidentId)
            .flatMap(x => x)
            .subscribe(a => {
                this.invalidCrews.push(a);
                this.invalidCrews.sort((a, b) => {
                    if (a.CrewName < b.CrewName) return -1;
                    if (a.CrewName > b.CrewName) return 1;
                    return 0;
                })
                console.log(this.invalidCrews);
            }),
            (error: any) => {
                console.log(`Error: ${error}`);
            };
        // ()=>{
        //      this.invalidCrews.forEach(a=>{
        //         if(a.LicenseRecords.indexOf(';') > 0)
        //             a.LicenseRecords.replace(';','; ');
        //         if(a.QualificationRecords.indexOf(';') > 0)
        //             a.QualificationRecords.replace(';','; ');
        //     })
        // };
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.IncidentId = incident.Value;

    };
}