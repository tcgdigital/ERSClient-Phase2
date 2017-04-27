import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {
    FormGroup,
    FormControl,
    FormBuilder,
    AbstractControl,
    Validators,
    ReactiveFormsModule
} from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { ToastrService, ToastrConfig } from 'ngx-toastr';


import { DepartmentService } from './department.service';
import { DepartmentModel } from './department.model';
import { UserProfileService, UserProfileModel } from '../../userprofile';
import { ResponseModel, UtilityService, DataExchangeService, BaseModel } from '../../../../shared';

@Component({
    selector: 'dept-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/department.entry.view.html'
})
export class DepartmentEntryComponent implements OnInit {
    form: FormGroup;
    users: UserProfileModel[] = [];
    parentDepartments: DepartmentModel[] = [];
    showAdd: boolean;
    departmentModel: DepartmentModel;
    constructor(private departmentService: DepartmentService, private userService: UserProfileService,
        private dataExchange: DataExchangeService<DepartmentModel>, private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) { }


    mergeResponses(): void {
        let activeUsers: Observable<ResponseModel<UserProfileModel>>
            = this.userService.GetAllActiveWithContact();
        let parentDepts: Observable<ResponseModel<DepartmentModel>>
            = this.departmentService.GetAll();

        Observable.merge(activeUsers, parentDepts)
            .subscribe(
            (response: ResponseModel<BaseModel>) => {
                if (response.Records.length > 0 && Object.keys(response.Records[0]).some(x => x === 'UserProfileId')) {
                    this.users = <UserProfileModel[]>response.Records;
                    this.users.forEach(x => {
                        x["caption"] = x.Name + " (" + x.MainContact + ")";
                    });
                } else if (response.Records.length > 0 && Object.keys(response.Records[0]).some(x => x === 'DepartmentId')) {
                    this.parentDepartments = <DepartmentModel[]>response.Records;
                }
            },
            (error) => { console.log(error); },
            () => {
                this.form = this.setDepartmentForm();
                this.dataExchange.Subscribe("departmentModelEdited", model => this.onDepartmentEdit(model));
            });
    }

    ngOnInit(): void {
        this.mergeResponses();
        this.departmentModel = new DepartmentModel();
        this.departmentModel.DepartmentId = 0;
        this.showAdd = false;
    }

    private onDepartmentEdit(model: DepartmentModel): void {
        this.form = this.setDepartmentForm(model);
        this.departmentModel = model;
        this.showAdd = true;
    }

    private setDepartmentForm(department?: DepartmentModel): FormGroup {
        return new FormGroup({
            DepartmentId: new FormControl(department ? department.DepartmentId : 0),
            DepartmentName: new FormControl(department ? department.DepartmentName : '', [Validators.required, Validators.minLength(1)]),
            Description: new FormControl(department ? department.Description : '', [Validators.required, Validators.minLength(1)]),
            ContactNo: new FormControl(department ? department.ContactNo : '', [Validators.required, Validators.minLength(1)]),
            DepartmentSpoc: new FormControl(department ? department.DepartmentSpoc : this.users[0].UserProfileId, [Validators.required, Validators.minLength(1)]),
            ParentDepartmentId: new FormControl((department && department.ParentDepartmentId) ? department.ParentDepartmentId : this.parentDepartments[0].DepartmentId, [Validators.required, Validators.minLength(1)]),
        });
    }


    onSubmit(values: DepartmentModel): void {
        if (values.DepartmentId == 0) {//ADD REGION

            UtilityService.setModelFromFormGroup<DepartmentModel>(this.departmentModel, this.form,
                x => x.DepartmentId, x => x.DepartmentName, x => x.Description, x => x.ContactNo, x => x.DepartmentSpoc, x => x.ParentDepartmentId);
            this.departmentModel.ContactNo = this.departmentModel.ContactNo.toString();
            this.departmentService.Create(this.departmentModel)
                .subscribe((response: DepartmentModel) => {
                    this.toastrService.success('Department Saved Successfully.', 'Success', this.toastrConfig);
                    this.dataExchange.Publish("departmentSavedOrEdited", response);
                    this.setDepartmentForm();
                    this.showAdd = false;
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {//EDIT REGION
            if (this.form.dirty) {
                this.departmentModel = new DepartmentModel();
                this.departmentModel.DepartmentId = values.DepartmentId;
                UtilityService.formDirtyCheck<DepartmentModel>(this.departmentModel, this.form,
                    x => x.DepartmentName, x => x.Description, x => x.ContactNo, x => x.DepartmentSpoc, x => x.ParentDepartmentId);
                this.departmentModel.deleteAttributes();
                this.departmentService.Update(this.departmentModel)
                    .subscribe((response: DepartmentModel) => {
                         this.toastrService.success('Department Edited Successfully.', 'Success', this.toastrConfig);
                        this.setDepartmentForm();
                        this.dataExchange.Publish("departmentSavedOrEdited", response);
                        this.showAdd = false;
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            }
        }
    }

    showAddRegion(): void {
        this.showAdd = true;
        this.departmentModel = new DepartmentModel();
        this.departmentModel.DepartmentId = 0;
        this.form = this.setDepartmentForm();
    }

<<<<<<< HEAD
    cancel() : void {
        this.showAdd = false;   
=======
    cancel(): void {
        this.showAdd = false;
>>>>>>> master
    }
}