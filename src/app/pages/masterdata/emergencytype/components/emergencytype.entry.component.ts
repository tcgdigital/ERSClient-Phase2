import {
    Component, ViewEncapsulation, OnInit, OnDestroy
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { EmergencyTypeService } from './emergencytype.service';
import { EmergencyTypeModel } from './emergencytype.model';
import {
    DataExchangeService, GlobalConstants,
    UtilityService, AuthModel
} from '../../../../shared';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'emergencytype-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/emergencytype.entry.view.html'
})
export class EmergencyTypeEntryComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    emergencyTypeModel: EmergencyTypeModel = new EmergencyTypeModel();
    emergencyTypeModelWithoutActive: EmergencyTypeModel = new EmergencyTypeModel();
    date: Date = new Date();
    emergencyTypes: EmergencyTypeModel[] = [];
    Action: string;
    showAdd: boolean = false;
    credential: AuthModel;
    public submitted: boolean;
    public showAddText: string = 'ADD CRISIS TYPE';
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    emergencyCategory: Object = GlobalConstants.EmergencyCategories;

    /**
     *Creates an instance of EmergencyTypeEntryComponent.
     * @param {EmergencyTypeService} emergencyTypeService
     * @param {DataExchangeService<EmergencyTypeModel>} dataExchange
     * @param {ToastrService} toastrService
     * @param {ToastrConfig} toastrConfig
     * @memberof EmergencyTypeEntryComponent
     */
    constructor(private emergencyTypeService: EmergencyTypeService,
        private dataExchange: DataExchangeService<EmergencyTypeModel>, 
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) { }

    onEmergencyTypeUpdate(model: EmergencyTypeModel): void {
        this.emergencyTypeModel = new EmergencyTypeModel();
        this.emergencyTypeModel = model;
        this.emergencyTypeModel.EmergencyTypeId = model.EmergencyTypeId;
        this.Action = "Edit";
        this.showAddRegion(this.showAdd);
        this.showAdd = true;
        this.form = new FormGroup({
            EmergencyTypeId: new FormControl(model.EmergencyTypeId),
            EmergencyTypeName: new FormControl(model.EmergencyTypeName),
            EmergencyCategory: new FormControl(model.EmergencyCategory),
            ActiveFlag: new FormControl(model.ActiveFlag)
        });

        window.scrollTo(0,0);
    }

    ngOnInit(): void {
        this.submitted = false;
        this.initiateForm();
        this.showAdd = false;
        this.emergencyTypeModel = new EmergencyTypeModel();
        this.credential = UtilityService.getCredentialDetails();
        this.emergencyTypeModel.EmergencyCategory = "FlightRelated";
        
        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.OnEmergencyTypeUpdate, 
            (model: EmergencyTypeModel) => this.onEmergencyTypeUpdate(model));
    }

    ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
    }
    
    onSubmit(): void {
        this.submitted = true;
        if (this.form.controls['EmergencyTypeName'].value == '') {
            this.toastrService.error('Please provide Crisis type name.', 'Error', this.toastrConfig);
            return null;
        }
        if (this.form.controls['EmergencyCategory'].value == '') {
            this.toastrService.error('Please provide Crisis type category.', 'Error', this.toastrConfig);
            return null;
        }
        if (this.form.controls['ActiveFlag'].value == '') {
            this.toastrService.error('Please provide status.', 'Error', this.toastrConfig);
            return null;
        }
        this.emergencyTypeModel.EmergencyTypeId = this.form.controls["EmergencyTypeId"].value;
        this.emergencyTypeModel.EmergencyTypeName = this.form.controls["EmergencyTypeName"].value;
        this.emergencyTypeModel.EmergencyCategory = this.form.controls["EmergencyCategory"].value;
        this.emergencyTypeModel.ActiveFlag = this.form.controls["ActiveFlag"].value;

        if (this.emergencyTypeModel.EmergencyTypeId == 0) {
            this.emergencyTypeModel.CreatedBy = +this.credential.UserId;
            this.emergencyTypeService.Create(this.emergencyTypeModel)
                .subscribe((response: EmergencyTypeModel) => {
                    this.resetForm();
                    this.showAddRegion(this.showAdd);
                    this.showAdd = false;
                    this.toastrService.success('Crisis Type saved Successfully.', 'Success', this.toastrConfig);
                    this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.EmergencyTypeModelSaved, response);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
            
            this.emergencyTypeModelWithoutActive = this.emergencyTypeModel;
            delete this.emergencyTypeModelWithoutActive.Active;
            this.emergencyTypeService.Update(this.emergencyTypeModelWithoutActive)
                .subscribe((response: EmergencyTypeModel) => {
                    this.resetForm();
                    this.showAddRegion(this.showAdd);
                    this.showAdd = false;
                    this.toastrService.success('Crisis Type edited Successfully.', 'Success', this.toastrConfig);
                    this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.EmergencyTypeModelUpdated, response);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }

    }

    cancel(): void {
        this.submitted = false;
        this.emergencyTypeModel = new EmergencyTypeModel();
        this.Action = "Save";
        this.initiateForm();
        this.showAddRegion(this.showAdd);
        this.showAdd = false;
        this.emergencyTypeModel.EmergencyCategory = "FlightRelated";
    }

    private initiateForm(): void {
        this.emergencyTypeModel.EmergencyTypeId = 0;
        this.form = new FormGroup({
            EmergencyTypeId: new FormControl(0),
            EmergencyTypeName: new FormControl('', [Validators.required]),
            EmergencyCategory: new FormControl('', [Validators.required]),
            ActiveFlag: new FormControl('', [Validators.required])
        });
    }

    private resetForm(): void {
        this.emergencyTypeModel.EmergencyTypeId = 0;
        this.form = new FormGroup({
            EmergencyTypeId: new FormControl(0),
            EmergencyTypeName: new FormControl('', [Validators.required]),
            EmergencyCategory: new FormControl('', [Validators.required]),
            ActiveFlag: new FormControl('', [Validators.required])
        });
    }
    // showAddRegion(ShowAdd: Boolean): void {
    //     this.showAdd = true;
    // }

    showAddRegion(value): void {
        if (!value) {
            this.showAddText = "CLICK TO COLLAPSE";
        }
        else {
            this.showAddText = "ADD CRISIS TYPE";
        }

        window.setInterval(()=>{
            jQuery(window).scroll();
        }, 100);
        
        this.showAdd = !value;
    }
}