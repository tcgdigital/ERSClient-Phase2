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
        UtilityService, GlobalConstants, GlobalStateService
       } from '../../../../shared';

import { MasterDataUploadForInvalidService } from '../masterdata.upload.invalid.records.service'
import { InvalidGroundVictimModel } from '../../../shared.components/'


@Component({
    selector: 'invalidGroundVictim-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../views/invalid/invalid.ground.victim.view.html'
})

export class InvalidGroundVictimListComponent implements OnInit, OnDestroy{
    invalidGroundVictims: InvalidGroundVictimModel[] = [];
    @Input() IncidentId: number;
    @Input() IsVisible: boolean;

    constructor(private _invalidRecordService: MasterDataUploadForInvalidService,
            private dataExchange: DataExchangeService<InvalidGroundVictimModel>,
            private globalState: GlobalStateService){}

    ngOnInit(): void{
      this.dataExchange.Subscribe("OpenInvalidGroundVictims", model => this.OpenInvalidGroundVictims(model));
      this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model)); 
    }

    
    getInvalidGroundVictims(): void {
        this._invalidRecordService.GetAllInvalidGroundVictimsByIncidentId(this.IncidentId)
        .flatMap(x=>x)
        .subscribe(a=>{
            this.invalidGroundVictims.push(a);
            console.log(this.invalidGroundVictims);
        }),
        (error: any) => {
            console.log(`Error: ${error}`);
        }
        ()=>{
            this.invalidGroundVictims.sort((a, b)=>{
                if (a.InvalidGroundVictimName < b.InvalidGroundVictimName) return -1;
                if (a.InvalidGroundVictimName > b.InvalidGroundVictimName) return 1;
                return 0;
            })
        };
    }

    OpenInvalidGroundVictims(groundVictim: InvalidGroundVictimModel): void{
        this.invalidGroundVictims = [];
        this.getInvalidGroundVictims();
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }

    ngOnDestroy(): void{
        this.dataExchange.Unsubscribe("OpenInvalidGroundVictims");
        this.dataExchange.Unsubscribe("incidentChange");
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.IncidentId = incident.Value;        
    }
}