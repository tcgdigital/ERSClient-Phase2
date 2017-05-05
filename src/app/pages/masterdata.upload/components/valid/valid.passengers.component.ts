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
    UtilityService, GlobalConstants, KeyValue, GlobalStateService
} from '../../../../shared';

import { MasterDataUploadForValidService } from '../masterdata.upload.valid.records.service'
import { InvolvePartyModel, AffectedPeopleModel, PassengerModel } from '../../../shared.components/'

@Component({
    selector: 'validPassengers-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../views/valid/valid.passenger.list.view.html'
})

export class ValidPassengersListComponent implements OnInit, OnDestroy{
        
    passengers: PassengerModel[] = []
    @Input() IncidentId: number;
    @Input() IsVisible: boolean;

    constructor(private _validRecordService: MasterDataUploadForValidService,
                private dataExchange: DataExchangeService<PassengerModel>,
                private globalState: GlobalStateService){}

    ngOnInit(): void{    
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));        
        this.dataExchange.Subscribe("OpenPassengers", model=>this.OpenPassengers(model));
    }

    OpenPassengers(passenger: PassengerModel): void{
        this.passengers=[];
        this.getValidPassengerRecords();
    }

    

    getValidPassengerRecords(): void{
        this._validRecordService.GetAllPassengerByIncidentId(this.IncidentId)
        .flatMap(x=>x)
        .subscribe(a=>{            
            this.passengers.push(a.Passenger);              
        }), 
        (error: any) => {
            console.log(`Error: ${error}`);
        };
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }

    ngOnDestroy(): void{
        this.dataExchange.Unsubscribe("OpenPassengers");
        this.globalState.Unsubscribe("incidentChange");
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.IncidentId = incident.Value;        
    };    
}



