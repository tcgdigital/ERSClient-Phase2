import { Component, ViewEncapsulation, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { DemandTypeService } from './demandtype.service';
import { DepartmentModel, DepartmentService } from '../../department';
import { DemandTypeModel } from './demandtype.model';
import { ResponseModel, DataExchangeService } from '../../../../shared';

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
    // @Output() demandTypeSaveEvent: EventEmitter<DemandTypeModel> = new EventEmitter(true);

    constructor(private demandTypeService: DemandTypeService,
        private departmentService: DepartmentService,
        private dataExchange: DataExchangeService<DemandTypeModel>) { }

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
        this.Action = "Edit"
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
        this.demandTypeModel.ActiveFlag = 'Active';
        this.demandTypeModel.CreatedBy = 1;
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

    ngOnInit(): any {
        this.getAllDepartments();
        this.form = new FormGroup({
            DemandTypeId: new FormControl(0),
            DemandTypeName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            IsAutoApproved: new FormControl(false),
            ApproverDept: new FormControl(this.demandTypeModel.DepartmentId, [Validators.required])
        });
        this.demandTypeModel.ActiveFlag = 'Active';
        this.demandTypeModel.CreatedBy = 1;
        this.demandTypeModel.CreatedOn = this.date;
        this.demandTypeModel.DemandTypeId = 0;
        this.Action = "Save";
        this.dataExchange.Subscribe("OnDemandUpdate", model => this.onDemandTypeUpdate(model));
    }

    onSubmit() {
        if (this.demandTypeModel.DemandTypeId == 0) {
            this.demandTypeModel.DemandTypeName = this.form.controls['DemandTypeName'].value;
            this.demandTypeModel.IsAutoApproved = this.form.controls['IsAutoApproved'].value;
            this.demandTypeModel.DepartmentId = this.form.controls['ApproverDept'].value;
            this.demandTypeService.Create(this.demandTypeModel)
                .subscribe((response: DemandTypeModel) => {
                    this.dataExchange.Publish("demandTypeModelSaved", response);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
            this.demandTypeService.Update(this.demandTypeModel)
                .subscribe((response: DemandTypeModel) => {
                    this.dataExchange.Publish("demandTypeModelUpdated", response);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("OnDemandUpdate");
    }
}