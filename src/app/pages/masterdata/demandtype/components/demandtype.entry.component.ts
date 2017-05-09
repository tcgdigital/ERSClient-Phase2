import { Component, ViewEncapsulation, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';


import { DemandTypeService } from './demandtype.service';
import { DepartmentModel, DepartmentService } from '../../department';
import { DemandTypeModel } from './demandtype.model';
import { ResponseModel, DataExchangeService, AuthModel, UtilityService } from '../../../../shared';

@Component({
    selector: 'demandtype-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/demandtype.entry.view.html'
})
export class DemandTypeEntryComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    demandTypeModel: DemandTypeModel = new DemandTypeModel();
    departments: DepartmentModel[] = [];
    date: Date = new Date();
    Action: string;
    showAdd: boolean;
    demandTypeModelToEdit: DemandTypeModel = new DemandTypeModel();
    credential: AuthModel;
    public showApproverDept: boolean;
    // @Output() demandTypeSaveEvent: EventEmitter<DemandTypeModel> = new EventEmitter(true);

    constructor(private demandTypeService: DemandTypeService,
        private departmentService: DepartmentService,
        private dataExchange: DataExchangeService<DemandTypeModel>, private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) { }

    getAllDepartments(): void {
        this.departmentService.GetAll()
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                this.departments = response.Records;
                this.demandTypeModel.DepartmentId = (this.demandTypeModel.DemandTypeId == 0)
                    ? this.departments[0].DepartmentId
                    : this.demandTypeModel.DepartmentId;
            });
    }

    onDemandTypeUpdate(model: DemandTypeModel): void {
        this.getAllDepartments();
        this.demandTypeModel = model;
        this.demandTypeModel.DepartmentId = model.DepartmentId;
        this.Action = "Edit";
        this.showAdd = true;
        delete this.demandTypeModel.ApproverDepartment;
        this.form = new FormGroup({
            DemandTypeId: new FormControl(model.DepartmentId),
            DemandTypeName: new FormControl(this.demandTypeModel.DemandTypeName, [Validators.required, Validators.maxLength(50)]),
            IsAutoApproved: new FormControl(this.demandTypeModel.IsAutoApproved),
            ApproverDept: new FormControl(this.demandTypeModel.DepartmentId, [Validators.required])
        });
    }

    cancel(): void {
        this.demandTypeModel = new DemandTypeModel();
        this.Action = "Save";
        this.showAdd = false;
        this.demandTypeModel.ActiveFlag = 'Active';
        this.demandTypeModel.CreatedBy = +this.credential.UserId;
        this.demandTypeModel.CreatedOn = this.date;
        this.demandTypeModel.DemandTypeId = 0;
        this.demandTypeModel.DepartmentId = this.departments[0].DepartmentId;
        this.form = new FormGroup({
            DemandTypeId: new FormControl(0),
            DemandTypeName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            IsAutoApproved: new FormControl(false),
            ApproverDept: new FormControl(this.demandTypeModel.DepartmentId, [Validators.required])
        });
    }

    IsAutoApproved(value: any): void {
        this.showApproverDept = !value.checked;
    }

    resetDemandTypeForm():void{
        this.form = new FormGroup({
            DemandTypeId: new FormControl(0),
            DemandTypeName: new FormControl('', [Validators.required]),
            IsAutoApproved: new FormControl(false),
            ApproverDept: new FormControl('', [Validators.required])
        });
    }

    ngOnInit(): any {
        this.showApproverDept = true;
        this.getAllDepartments();
        this.showAdd = false;
        this.resetDemandTypeForm();
        this.credential = UtilityService.getCredentialDetails();
        this.demandTypeModel.ActiveFlag = 'Active';
        this.demandTypeModel.CreatedBy = +this.credential.UserId;
        this.demandTypeModel.CreatedOn = this.date;
        this.demandTypeModel.DemandTypeId = 0;
        this.Action = "Save";
        this.dataExchange.Subscribe("OnDemandUpdate", model => this.onDemandTypeUpdate(model));
    }

    onSubmit() {
        if ((this.showApproverDept == false && this.form.controls['ApproverDept'].value == '' && this.form.controls['DemandTypeName'].value != '') ||
            (this.showApproverDept == true && this.form.controls['ApproverDept'].value != '' && this.form.controls['DemandTypeName'].value != '')) {
            if (this.demandTypeModel.DemandTypeId == 0) {
                this.demandTypeModel.DemandTypeName = this.form.controls['DemandTypeName'].value;
                this.demandTypeModel.IsAutoApproved = this.form.controls['IsAutoApproved'].value;
                this.demandTypeModel.DepartmentId = this.form.controls['ApproverDept'].value == '' ? null : this.form.controls['ApproverDept'].value;
                this.demandTypeService.Create(this.demandTypeModel)
                    .subscribe((response: DemandTypeModel) => {
                        this.resetDemandTypeForm();
                        this.toastrService.success('Demand Saved Successfully.', 'Success', this.toastrConfig);
                        this.dataExchange.Publish("demandTypeModelSaved", response);
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            }
            else {
                this.formControlDirtyCheck();
                this.demandTypeService.Update(this.demandTypeModelToEdit)
                    .subscribe((response: DemandTypeModel) => {
                        this.toastrService.success('Demand Edited Successfully.', 'Success', this.toastrConfig);
                        this.dataExchange.Publish("demandTypeModelUpdated", response);
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            }
        }
    }


    formControlDirtyCheck(): void {
        this.demandTypeModelToEdit = new DemandTypeModel();
        this.demandTypeModelToEdit.deleteAttributes();

        this.demandTypeModelToEdit.DemandTypeId = this.form.controls['DemandTypeId'].value;

        if (this.form.controls['DemandTypeName'].touched) {
            this.demandTypeModelToEdit.DemandTypeName = this.form.controls['Priority'].value;
        }
        if (this.form.controls['IsAutoApproved'].touched) {
            this.demandTypeModelToEdit.IsAutoApproved = this.form.controls['DemandDesc'].value;
        }
        if (this.form.controls['ApproverDept'].touched) {
            this.demandTypeModelToEdit.ApproverDepartment = this.form.controls['RequestedBy'].value;
        }
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("OnDemandUpdate");
    }

    showAddRegion(ShowAdd: Boolean): void {
        this.showAdd = true;
        this.form = new FormGroup({
            DemandTypeId: new FormControl(0),
            DemandTypeName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            IsAutoApproved: new FormControl(false),
            ApproverDept: new FormControl(this.demandTypeModel.DepartmentId, [Validators.required])
        });
        this.demandTypeModel.ActiveFlag = 'Active';
        this.demandTypeModel.CreatedBy = +this.credential.UserId;
        this.demandTypeModel.CreatedOn = this.date;
        this.demandTypeModel.DemandTypeId = 0;
        this.Action = "Save";
        // this.buttonValue = "Show Add Checklist";
    }
}