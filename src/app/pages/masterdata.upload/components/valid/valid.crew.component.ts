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
import { InvolvePartyModel, AffectedPeopleModel, CrewModel } from '../../../shared.components/'

@Component({
    selector: 'validCrew-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../views/valid/valid.crew.list.view.html'
})

export class ValidCrewListComponent implements OnInit, OnDestroy {
        
    crews: CrewModel[] = []
    @Input() IncidentId: number;
    @Input() IsVisible: boolean;

    constructor(private _validRecordService: MasterDataUploadForValidService,
                private dataExchange: DataExchangeService<CrewModel>,
                private globalState: GlobalStateService){}   

    ngOnInit(): void{
      this.dataExchange.Subscribe("OpenCrews", model => this.OpenCrews(model));
      this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model)); 
    }

    OpenCrews(Crew: CrewModel): void{
        this.crews = [];
        this.getValidCrewRecords();
    }

    //  public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    //     if (changes['IncidentId'].currentValue !==
    //         changes['IncidentId'].previousValue) {
    //              this.dataExchange.Subscribe("OpenCrews", model => this.OpenCrews(model));
    //         }
    // }


    getValidCrewRecords(): void{
        this._validRecordService.GetAllCrewByIncidentId(this.IncidentId)
        .flatMap(x=>x)
        .subscribe(a=>{
            this.crews.push(a.Crew); 
            console.log(this.crews);             
        }), 
        (error: any) => {
            console.log(`Error: ${error}`);
        };
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }

    ngOnDestroy(): void{
        this.dataExchange.Unsubscribe("OpenCrews");
        this.dataExchange.Unsubscribe("incidentChange");
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.IncidentId = incident.Value;        
    }
}