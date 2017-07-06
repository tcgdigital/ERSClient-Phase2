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

import { MasterDataUploadForValidService } from '../masterdata.upload.valid.records.service'
import { GroundVictimModel } from '../../../shared.components/'


@Component({
    selector: 'validGroundVictim-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../views/valid/valid.ground.victim.list.view.html'
})

export class ValidGroundVictimListComponent implements OnInit, OnDestroy{
    groundVictims: GroundVictimModel[] = [];
    @Input() IncidentId: number;
    @Input() IsVisible: boolean;

    constructor(private _validRecordService: MasterDataUploadForValidService,
            private dataExchange: DataExchangeService<GroundVictimModel>,
            private globalState: GlobalStateService){}

    ngOnInit(): void{
      this.dataExchange.Subscribe("OpenGroundVictims", model => this.OpenGroundVictims(model));
      this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model)); 
    }

    
    getValidGroundVictims(): void {       
        this._validRecordService.GetAllGroundVictimsByIncidentId(this.IncidentId)
        .flatMap(x=>x)
        .subscribe(a=>{            
            this.groundVictims.push(a);
            console.log(this.groundVictims);
        }),
        (error: any) => {
            console.log(`Error: ${error}`);
        };
    }

    OpenGroundVictims(groundVictim: GroundVictimModel): void {
        this.groundVictims = [];
        this.getValidGroundVictims();
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }

    ngOnDestroy(): void{
        this.dataExchange.Unsubscribe("OpenGroundVictims");
        this.dataExchange.Unsubscribe("incidentChange");
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.IncidentId = incident.Value;        
    }
}