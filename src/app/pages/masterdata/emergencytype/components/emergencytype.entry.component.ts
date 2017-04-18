import {
    Component, ViewEncapsulation,
    Output, EventEmitter, OnInit
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { EmergencyTypeService } from './emergencytype.service';
import { EmergencyTypeModel } from './emergencytype.model';
import {
    ResponseModel, DataExchangeService, GlobalConstants,
    BaseModel, UtilityService
} from '../../../../shared';

@Component({
    selector: 'emergencytype-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/emergencytype.entry.view.html'
})
export class EmergencyTypeEntryComponent implements OnInit {
    public form: FormGroup;
    emergencyTypeModel: EmergencyTypeModel = new EmergencyTypeModel();
    emergencyTypeModelWithoutActive: EmergencyTypeModel = new EmergencyTypeModel();
    date: Date = new Date();
    emergencyTypes: EmergencyTypeModel[] = [];
    Action: string;
    showAdd : boolean;

    emergencyCategory: Object = GlobalConstants.EmergencyCategories;

    constructor(private emergencyTypeService: EmergencyTypeService,
        private dataExchange: DataExchangeService<EmergencyTypeModel>) { }

    onEmergencyTypeUpdate(model: EmergencyTypeModel): void {
        this.emergencyTypeModel = model;
        this.emergencyTypeModel.EmergencyTypeId = model.EmergencyTypeId;
        this.Action = "Edit";
        this.showAdd = true;
    }

    ngOnInit(): void {
        this.initiateForm();
        this.showAdd = false;
        this.emergencyTypeModel = new EmergencyTypeModel();
        this.emergencyTypeModel.EmergencyCategory = "FlightRelated";
        this.dataExchange.Subscribe("OnEmergencyTypeUpdate", model => this.onEmergencyTypeUpdate(model))
    }

    onSubmit() {
        // UtilityService.setModelFromFormGroup<EmergencyTypeModel>(this.emergencyTypeModel, this.form,
        //     x => x.EmergencyTypeId, x => x.EmergencyTypeName, x => x.EmergencyCategory, x => x.ActiveFlag);

        this.emergencyTypeModel.EmergencyTypeId = this.form.controls["EmergencyTypeId"].value;
        this.emergencyTypeModel.EmergencyTypeName = this.form.controls["EmergencyTypeName"].value;
        this.emergencyTypeModel.EmergencyCategory = this.form.controls["EmergencyCategory"].value;
        this.emergencyTypeModel.ActiveFlag = this.form.controls["ActiveFlag"].value;

        if (this.emergencyTypeModel.EmergencyTypeId == 0) {
            this.emergencyTypeService.Create(this.emergencyTypeModel)
                .subscribe((response: EmergencyTypeModel) => {
                    this.dataExchange.Publish("EmergencyTypeModelSaved", response);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
            this.emergencyTypeModelWithoutActive = this.emergencyTypeModel;
            delete this.emergencyTypeModelWithoutActive.Active;
            this.emergencyTypeService.Update(this.emergencyTypeModelWithoutActive)
                .subscribe((response: EmergencyTypeModel) => {
                    this.dataExchange.Publish("EmergencyTypeModelUpdated", response);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
    }

    cancel(): void {
        this.emergencyTypeModel = new EmergencyTypeModel();
        this.Action = "Save";
        this.initiateForm();
        this.showAdd = false;
        this.emergencyTypeModel.EmergencyCategory = "FlightRelated";
    }

    private initiateForm(): void {
        this.form = new FormGroup({
            EmergencyTypeId: new FormControl(0),
            EmergencyTypeName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            EmergencyCategory: new FormControl("FlightRelated"),
            ActiveFlag: new FormControl("Active")
        });
    }
     showAddRegion(ShowAdd: Boolean): void {
        this.showAdd = true;
     }
}