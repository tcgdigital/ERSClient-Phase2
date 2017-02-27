import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EmergencyTypeModel } from './emergencytype.model';
import { EmergencyTypeService } from './emergencytype.service';
import { ResponseModel,DataExchangeService } from '../../../../shared';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'emergencytype-detail',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/emergencytype.detail.view.html'
})
export class EmergencyTypeDetailComponent{
    emergencyTypes: EmergencyTypeModel[] = [];

    constructor(private emergencyTypeService: EmergencyTypeService,
    private dataExchange: DataExchangeService<EmergencyTypeModel>) { }

    getEmergencyTypes(): void {
        this.emergencyTypeService.GetAll()
            .subscribe((response: ResponseModel<EmergencyTypeModel>) => {
                console.log(response);
                this.emergencyTypes = response.Records;
            });    
    }

     onEmergencyTypeSuccess(data: EmergencyTypeModel): void {        
        console.log("EventCalling");
       this.getEmergencyTypes();
    }
   
    UpdateEmergencyType(emergencyTypeModelUpdate: EmergencyTypeModel): void{
        let emergencyModelToSend=Object.assign({}, emergencyTypeModelUpdate)
        this.dataExchange.Publish("OnEmergencyTypeUpdate",emergencyModelToSend);
    }


    ngOnInit(): any {
        this.getEmergencyTypes();
        this.dataExchange.Subscribe("EmergencyTypeModelSaved", model => this.onEmergencyTypeSuccess(model));
        this.dataExchange.Subscribe("EmergencyTypeModelUpdated", model =>this.onEmergencyTypeSuccess(model))
    }
}