import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { EmergencyTypeModel } from './emergencytype.model';
import { EmergencyTypeService } from './emergencytype.service';
import { ResponseModel, DataExchangeService } from '../../../../shared';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'emergencytype-detail',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/emergencytype.detail.view.html'
})
export class EmergencyTypeDetailComponent implements OnInit, OnDestroy {
    emergencyTypes: EmergencyTypeModel[] = [];

    /**
     * Creates an instance of EmergencyTypeDetailComponent.
     * @param {EmergencyTypeService} emergencyTypeService 
     * @param {DataExchangeService<EmergencyTypeModel>} dataExchange 
     * 
     * @memberOf EmergencyTypeDetailComponent
     */
    constructor(private emergencyTypeService: EmergencyTypeService,
        private dataExchange: DataExchangeService<EmergencyTypeModel>) { }

    /**
     * Get all emergency types
     * 
     * @memberOf EmergencyTypeDetailComponent
     */
    getEmergencyTypes(): void {
        this.emergencyTypeService.GetAll()
            .subscribe((response: ResponseModel<EmergencyTypeModel>) => {
                this.emergencyTypes = response.Records;
                 this.emergencyTypes.forEach(x => {
                    x["Active"] = (x.ActiveFlag == 'Active');
                });
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    onSuccess(data: EmergencyTypeModel): void {
        this.getEmergencyTypes();
    }

    UpdateEmergencyType(emergencyTypeModelUpdate: EmergencyTypeModel): void {
        let emergencyModelToSend = Object.assign({}, emergencyTypeModelUpdate)
        this.dataExchange.Publish("OnEmergencyTypeUpdate", emergencyModelToSend);
    }


    ngOnInit(): void {
        this.getEmergencyTypes();
        this.dataExchange.Subscribe('EmergencyTypeModelSaved', model => this.onSuccess(model));
        this.dataExchange.Subscribe('EmergencyTypeModelUpdated', model => this.onSuccess(model))
    }

    /**
     * Destroy all subscription
     * 
     * @memberOf EmergencyTypeDetailComponent
     */
    ngOnDestroy(): void {
        //this.dataExchange.Unsubscribe('OnEmergencyTypeUpdate');
        this.dataExchange.Unsubscribe('EmergencyTypeModelSaved');
        this.dataExchange.Unsubscribe('EmergencyTypeModelUpdated');
    }
}