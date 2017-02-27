import { Component, ViewEncapsulation, Output, EventEmitter , OnInit} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EmergencyTypeService } from './emergencytype.service';
import { EmergencyTypeModel } from './emergencytype.Model';
import { ResponseModel,DataExchangeService } from '../../../../shared';
import { GlobalConstants } from '../../../../shared/constants';


@Component({
    selector: 'emergencytype-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/emergencytype.entry.view.html'
})
export class EmergencyTypeEntryComponent implements OnInit{
    constructor(private emergencyTypeService: EmergencyTypeService,
    private dataExchange: DataExchangeService<EmergencyTypeModel>) { }
    emergencyTypeModel: EmergencyTypeModel = new EmergencyTypeModel();
    date: Date = new Date();
    emergencyTypes: EmergencyTypeModel[]=[];
    Action: string;
   
    emergencyCategory : Object = GlobalConstants.EmergencyCategories;
    
    onEmergencyTypeUpdate(model: EmergencyTypeModel): void{
        this.emergencyTypeModel = model;
        this.emergencyTypeModel.EmergencyTypeId = model.EmergencyTypeId;       
        console.log(this.emergencyTypeModel.EmergencyTypeId);
        this.Action = "Edit";
    }

    ngOnInit(): void {
        
        this.emergencyTypeModel.EmergencyTypeId = 0;
        this.emergencyTypeModel.ActiveFlag = "Active";
        this.emergencyTypeModel.CreatedBy = 1;
        this.emergencyTypeModel.CreatedOn = this.date;
        this.emergencyTypeModel.EmergencyCategory = "FlightRelated";       
        this.dataExchange.Subscribe("OnEmergencyTypeUpdate",model => this.onEmergencyTypeUpdate(model))
    }
    
    onSubmit() {
        if(this.emergencyTypeModel.EmergencyTypeId == 0){        
        this.emergencyTypeService.Create(this.emergencyTypeModel)
        .subscribe((response: EmergencyTypeModel) => {                
                console.log("Success");
                this.dataExchange.Publish("EmergencyTypeModelSaved", response);
            }, (error: any) => {
                console.log("Error");
            });
        }
        else{
            this.emergencyTypeService.Update(this.emergencyTypeModel)
            .subscribe((response: EmergencyTypeModel) => {                
                console.log("Success");
                this.dataExchange.Publish("EmergencyTypeModelUpdated", response);
            }, (error: any) => {
                console.log("Error");
            });
        }
    }    
}