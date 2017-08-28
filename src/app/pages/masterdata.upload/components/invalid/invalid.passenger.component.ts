import {
    Component, ViewEncapsulation, Input, OnChanges, 
    OnInit, OnDestroy, AfterContentInit, ViewChild, SimpleChange,
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
import { InvalidPassengerModel } from '../../../shared.components/'

@Component({
    selector: 'invalidPassengers-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../../views/invalid/invalid.passenger.view.html'
})

export class InvalidPassengersListComponent implements OnInit, OnDestroy{
        
    invalidPassengers: InvalidPassengerModel[] = []
    @Input() IncidentId: number;
    @Input() IsVisible: boolean;

    constructor(private _invalidRecordService: MasterDataUploadForInvalidService,
    private dataExchange: DataExchangeService<InvalidPassengerModel>,
    private globalState: GlobalStateService){}

    ngOnInit(): void{
         this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
         this.dataExchange.Subscribe("OpenInvalidPassengers", model => this.openInvalidPassengers(model));
    }

    openInvalidPassengers(invalidPassenger: InvalidPassengerModel): void{
        this.invalidPassengers=[];
        this.getInvalidPassengerRecords();
    }

      

    ngOnDestroy(): void{
        this.dataExchange.Unsubscribe("OpenInvalidPassengers");
        this.globalState.Unsubscribe("incidentChange");
    }

    getInvalidPassengerRecords(): void{
        this.invalidPassengers = [];
        this._invalidRecordService.GetAllInvalidPassengersByIncident(this.IncidentId)
        .flatMap(x=>x)
        .subscribe(a=>{         
            this.invalidPassengers.push(a);
            console.log(this.invalidPassengers);              
        }), 
        (error: any) => {
            console.log(`Error: ${error}`);
        }
        ()=>{
            this.invalidPassengers.sort((a, b)=>{
                if (a.PassengerName < b.PassengerName) return -1;
                if (a.PassengerName > b.PassengerName) return 1;
                return 0;
            })
        };
    }

    cancel(): void {
        this.IsVisible = !this.IsVisible;
    }

     private incidentChangeHandler(incident: KeyValue): void {
        this.IncidentId = incident.Value;       
    };    
}



