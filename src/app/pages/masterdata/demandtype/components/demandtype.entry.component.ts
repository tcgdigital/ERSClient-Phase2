import {
    Component, ViewEncapsulation,
    Output, EventEmitter, OnInit, OnDestroy
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators
} from '@angular/forms';
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
    showAdd: boolean = false;
    demandTypeModelToEdit: DemandTypeModel = new DemandTypeModel();
    credential: AuthModel;
    public showApproverDept: boolean;
    public autoApproved: boolean;
    public submitted: boolean;
    public showAddText: string = 'ADD DEMAND TYPE';

    constructor(private demandTypeService: DemandTypeService,
        private departmentService: DepartmentService,
        private dataExchange: DataExchangeService<DemandTypeModel>, private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) { }

    getAllDepartments(): void {
        this.departmentService.GetAll()
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                this.departments = response.Records;                
                console.log(this.departments);
                this.demandTypeModel.DepartmentId = (this.demandTypeModel.DemandTypeId === 0)
                    ? this.departments[0].DepartmentId
                    : this.demandTypeModel.DepartmentId;
            });
    }

    onDemandTypeUpdate(model: DemandTypeModel): void {
        //  this.getAllDepartments();
        this.demandTypeModel = model;
        this.demandTypeModel.DepartmentId = model.DepartmentId;
        let approverDept = this.demandTypeModel.IsAutoApproved ? '' : model.DepartmentId.toString();
        this.Action = 'Submit';
        this.showAddRegion(this.showAdd);
        this.showAdd = true;
        this.showApproverDept = !this.demandTypeModel.IsAutoApproved;
        this.autoApproved = this.demandTypeModel.IsAutoApproved;
        delete this.demandTypeModel.ApproverDepartment;
        this.form = new FormGroup({
            DemandTypeId: new FormControl(model.DemandTypeId),
            DemandTypeName: new FormControl(this.demandTypeModel.DemandTypeName, [Validators.required, Validators.maxLength(50)]),
            IsAutoApproved: new FormControl(this.demandTypeModel.IsAutoApproved),
            ApproverDept: new FormControl(approverDept, [Validators.required])
        });

        window.scrollTo(0,0);
    }

    cancel(): void {
        this.submitted = false;
        this.demandTypeModel = new DemandTypeModel();
        this.Action = 'Submit';
        this.showAddRegion(this.showAdd);
        this.showAdd = false;
        this.demandTypeModel.ActiveFlag = 'Active';
        this.demandTypeModel.CreatedBy = +this.credential.UserId;
        this.demandTypeModel.CreatedOn = this.date;
        this.demandTypeModel.DemandTypeId = 0;
        this.demandTypeModel.DepartmentId = 0;
        this.form = new FormGroup({
            DemandTypeId: new FormControl(0),
            DemandTypeName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            IsAutoApproved: new FormControl(false),
            ApproverDept: new FormControl('', [Validators.required])
        });
         this.showApproverDept = true;
    }

    IsAutoApproved(value: any): void {
        this.showApproverDept = !value.checked;
        this.form.controls["ApproverDept"].reset({value: '',disabled:false});
    }

    resetDemandTypeForm(): void {
        this.form = new FormGroup({
            DemandTypeId: new FormControl(0),
            DemandTypeName: new FormControl('', [Validators.required]),
            IsAutoApproved: new FormControl(false),
            ApproverDept: new FormControl('', [Validators.required])
        });
        this.showApproverDept = true;
    }

    ngOnInit(): any {
        this.submitted = false;
        this.showApproverDept = true;
        this.autoApproved = true;
        this.getAllDepartments();
        this.showAdd = false;
        this.resetDemandTypeForm();
        this.credential = UtilityService.getCredentialDetails();
        this.demandTypeModel.ActiveFlag = 'Active';
        this.demandTypeModel.CreatedBy = +this.credential.UserId;
        this.demandTypeModel.CreatedOn = this.date;
        this.demandTypeModel.DemandTypeId = 0;
        this.Action = 'Submit';
        this.dataExchange.Subscribe('OnDemandUpdate', (model) => this.onDemandTypeUpdate(model));
    }

    onSubmit() {
        this.submitted = true;
        if (this.demandTypeModel.DemandTypeId === 0) {
            if (this.form.controls['DemandTypeName'].value == '') {
                this.toastrService.error('Please provide request type.', 'Error', this.toastrConfig);
                return false;
            }
            this.demandTypeModel.DemandTypeName = this.form.controls['DemandTypeName'].value;
            this.demandTypeModel.IsAutoApproved = this.form.controls['IsAutoApproved'].value;
            if (!this.demandTypeModel.IsAutoApproved) {
                if (this.form.controls['ApproverDept'].value == '') {
                    this.toastrService.error('Please provide approver department.', 'Error', this.toastrConfig);
                    return false;
                }
                else {
                    this.demandTypeModel.DepartmentId = this.form.controls['ApproverDept'].value;
                }
            }
            else {
              this.demandTypeModel.DepartmentId= null;
            }
            
            this.demandTypeModel.ActiveFlag = 'Active';
            this.demandTypeModel.CreatedBy = +this.credential.UserId;
            this.demandTypeModel.CreatedOn = this.date;

            this.demandTypeService.Create(this.demandTypeModel)
                .subscribe((response: DemandTypeModel) => {
                    this.toastrService.success('Demand Saved Successfully.', 'Success', this.toastrConfig);
                    this.resetDemandTypeForm();
                    this.showApproverDept = true;
                    this.showAddRegion(this.showAdd);
                    this.demandTypeModel = new DemandTypeModel();
                    
                    this.showAdd = false;
                    this.dataExchange.Publish('demandTypeModelSaved', response);

                }, (error: any) => {
                    this.toastrService.error(error.message, 'Error', this.toastrConfig);
                    console.log(`Error: ${error}`);
                });
        }
        else {
            this.formControlDirtyCheck();
             if (this.showApproverDept) {
                if (this.form.controls['ApproverDept'].value == '') {
                    this.toastrService.error('Please provide approver department.', 'Error', this.toastrConfig);
                    return false;
                }
                else {
                    this.demandTypeModelToEdit.DepartmentId = this.form.controls['ApproverDept'].value;
                }
            }
            else {
                this.demandTypeModelToEdit.DepartmentId = null;
            }
            this.demandTypeService.Update(this.demandTypeModelToEdit, this.demandTypeModelToEdit.DemandTypeId)
                .subscribe((response: DemandTypeModel) => {
                    this.toastrService.success('Demand Edited Successfully.', 'Success', this.toastrConfig);
                    this.resetDemandTypeForm();
                    this.showApproverDept = true;
                    this.showAddRegion(this.showAdd);
                    this.demandTypeModel = new DemandTypeModel();
                    this.showAdd = false;
                    this.dataExchange.Publish('demandTypeModelUpdated', response);
                }, (error: any) => {
                    this.toastrService.error(error.message, 'Error', this.toastrConfig);
                    console.log(`Error: ${error}`);
                });
        }

    }

    formControlDirtyCheck(): void {
        this.demandTypeModelToEdit = new DemandTypeModel();
        this.demandTypeModelToEdit.deleteAttributes();

        this.demandTypeModelToEdit.DemandTypeId = this.form.controls['DemandTypeId'].value;

        if (this.form.controls['DemandTypeName'].touched) {
            this.demandTypeModelToEdit.DemandTypeName = this.form.controls['DemandTypeName'].value;
        }
        if (this.form.controls['IsAutoApproved'].touched) {
            this.demandTypeModelToEdit.IsAutoApproved = this.form.controls['IsAutoApproved'].value;
            this.showApproverDept = !this.form.controls['IsAutoApproved'].value;
        }
        if (this.form.controls['ApproverDept'].touched) {
            this.demandTypeModelToEdit.DepartmentId = +this.form.controls['ApproverDept'].value;
        }
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('OnDemandUpdate');
    }

    showAddRegion(value): void {
        // this.showAdd = true;
        if (!value) {
            this.showAddText = "CLICK TO COLLAPSE";
        }
        else {
            this.showAddText = "ADD DEMAND TYPE";
        }
        
        window.setInterval(()=>{
            jQuery(window).scroll();
        }, 100);

        this.showAdd = !value;
        // this.form = new FormGroup({
        //     DemandTypeId: new FormControl(0),
        //     DemandTypeName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
        //     IsAutoApproved: new FormControl(false),
        //     ApproverDept: new FormControl('', [Validators.required])
        // });
        // this.demandTypeModel.ActiveFlag = 'Active';
        // this.demandTypeModel.CreatedBy = +this.credential.UserId;
        // this.demandTypeModel.CreatedOn = this.date;
        // this.demandTypeModel.DemandTypeId = 0;
        this.Action = 'Submit';
    }

}
