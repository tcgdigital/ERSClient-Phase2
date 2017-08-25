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
import {
    ResponseModel, UtilityService, GlobalConstants,
    DataExchangeService, BaseModel, AuthModel
} from '../../../../shared';

@Component({
    selector: 'dept-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/department.entry.view.html'
})
export class DepartmentEntryComponent implements OnInit {
    form: FormGroup;
    users: UserProfileModel[] = [];
    parentDepartments: DepartmentModel[] = [];
    showAdd: boolean = false;
    departmentModel: DepartmentModel;
    credential: AuthModel;
    submitted: boolean = false;
    public showAddText: string = 'ADD DEPARTMENT';

    constructor(private departmentService: DepartmentService,
        private userService: UserProfileService,
        private dataExchange: DataExchangeService<DepartmentModel>,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) { }

    mergeResponses(): void {
        const activeUsers: Observable<ResponseModel<UserProfileModel>>
            = this.userService.GetAllActiveWithContact();
        const parentDepts: Observable<ResponseModel<DepartmentModel>>
            = this.departmentService.GetAll();

        Observable.merge(activeUsers, parentDepts)
            .subscribe(
            (response: ResponseModel<BaseModel>) => {
                debugger;
                if (response.Records.length > 0
                    && Object.keys(response.Records[0]).some((x) => x === 'UserProfileId')) {
                    this.users = response.Records as UserProfileModel[];
                    this.users.forEach((x) => {
                        x['caption'] = `${x.Name} (${x.MainContact})`;
                    });
                this.users = this.users.sort(function (a, b) { return (a.Name.trim().toUpperCase() > b.Name.trim().toUpperCase()) ? 1 : ((b.Name.trim().toUpperCase() > a.Name.trim().toUpperCase()) ? -1 : 0); });
                } else if (response.Records.length > 0
                    && Object.keys(response.Records[0]).some((x) => x === 'DepartmentId')) {
                    this.parentDepartments = response.Records as DepartmentModel[];
                }
            },
            (error) => { console.log(error); },
            () => {
                this.form = this.setDepartmentForm();
                this.dataExchange.Subscribe('departmentModelEdited', (model) => this.onDepartmentEdit(model));
            });
    }

    ngOnInit(): void {
        this.mergeResponses();
        this.departmentModel = new DepartmentModel();
        this.credential = UtilityService.getCredentialDetails();
        this.resetDepartmentForm();
        this.departmentModel.CreatedBy = +this.credential.UserId;
        this.departmentModel.DepartmentId = 0;
        this.showAdd = false;
    }

    resetDepartmentForm(): void {
        
        this.form = new FormGroup({
            DepartmentCode: new FormControl('', [Validators.required]),
            Description: new FormControl('', [Validators.required]),
            ContactNo: new FormControl('', [Validators.required]),
            DepartmentSpoc: new FormControl(null),
            ParentDepartmentId: new FormControl('')
        });
    }

    onSubmit(values: DepartmentModel): void {
        // if (this.form.controls['DepartmentName'].value == '') {
        //     this.toastrService.error('Please provide department code.', 'Error', this.toastrConfig);
        //     return null;
        // }
        // if (this.form.controls['Description'].value == '') {
        //     this.toastrService.error('Please provide department name.', 'Error', this.toastrConfig);
        //     return null;
        // }
        // if (this.form.controls['ContactNo'].value == '') {
        //     this.toastrService.error('Please provide contact number.', 'Error', this.toastrConfig);
        //     return null;
        // }
        // if (this.form.controls['DepartmentSpoc'].value == '') {
        //     this.toastrService.error('Please provide department spoc.', 'Error', this.toastrConfig);
        //     return null;
        // }
        // if (this.form.controls['ParentDepartmentId'].value == '') {
        //     this.toastrService.error('Please provide parent department.', 'Error', this.toastrConfig);
        //     return null;
        // }
        this.submitted = true;
        if (this.form.valid) {
            if (values.DepartmentId === 0) {
                // ADD REGION
                UtilityService.setModelFromFormGroup<DepartmentModel>(this.departmentModel, this.form,
                    (x) => x.DepartmentId,
                    (x) => x.DepartmentName,
                    (x) => x.Description,
                    (x) => x.ContactNo,
                    (x) => x.DepartmentSpoc,
                    (x) => x.ParentDepartmentId);

                this.departmentModel.ContactNo = this.departmentModel.ContactNo.toString().replace(/^\D+/g, '');
                this.departmentModel.CreatedBy = +this.credential.UserId;
                if (this.form.controls['ParentDepartmentId'].value == '') {
                    this.departmentModel.ParentDepartmentId = null;
                }
                else {
                    this.departmentModel.ParentDepartmentId = +this.form.controls['ParentDepartmentId'].value;
                }
                this.departmentService.Create(this.departmentModel)
                    .subscribe((response: DepartmentModel) => {
                        this.toastrService.success(`Department Saved Successfully. ${GlobalConstants.departmentAndFunctionalityReloginMessage}`, 'Success', this.toastrConfig);
                        this.dataExchange.Publish('departmentSavedOrEdited', response);
                        this.resetDepartmentForm();
                        this.mergeResponses();
                        this.showAddRegion(this.showAdd);
                        this.showAdd = false;
                        this.submitted = false;
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            }
            else {
                // EDIT REGION

                this.departmentModel = new DepartmentModel();
                this.departmentModel.DepartmentId = values.DepartmentId;

                UtilityService.formDirtyCheck<DepartmentModel>(this.departmentModel, this.form,
                    (x) => x.DepartmentName,
                    (x) => x.Description,
                    (x) => x.ContactNo,
                    (x) => x.DepartmentSpoc,
                    (x) => x.ParentDepartmentId);

                this.departmentModel.deleteAttributes();
                if (this.form.controls['ParentDepartmentId'].value == '') {
                    this.departmentModel.ParentDepartmentId = null;
                }
                else {
                    this.departmentModel.ParentDepartmentId = +this.form.controls['ParentDepartmentId'].value;
                }
                if (this.departmentModel.ContactNo) {
                    this.departmentModel.ContactNo = this.departmentModel.ContactNo.toString().replace(/^\D+/g, '');
                }
                if(this.departmentModel.DepartmentSpoc.toString()=='null'){
                    this.departmentModel.DepartmentSpoc=null;
                }
                this.departmentService.Update(this.departmentModel, this.departmentModel.DepartmentId)
                    .subscribe((response: DepartmentModel) => {
                        this.toastrService.success(`Department updated Successfully.  ${GlobalConstants.departmentAndFunctionalityReloginMessage}`, 'Success', this.toastrConfig);
                        this.dataExchange.Publish('departmentSavedOrEdited', response);
                        this.resetDepartmentForm();
                        this.mergeResponses();
                        this.showAddRegion(this.showAdd);
                        this.showAdd = false;
                        this.submitted = false;
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            }
        }
    }

    // showAddRegion(): void {
    //     this.showAdd = true;
    //     this.submitted = false;
    //     this.departmentModel = new DepartmentModel();
    //     this.departmentModel.CreatedBy = +this.credential.UserId;
    //     this.departmentModel.DepartmentId = 0;
    //     this.form = this.setDepartmentForm();
    // }

    showAddRegion(value): void {
        if (!value) {
            this.showAddText = "CLICK TO COLLAPSE";
        }
        else {
            this.showAddText = "ADD DEPARTMENT";
        }

        window.setInterval(()=>{
            jQuery(window).scroll();
        }, 100);
        
        this.showAdd = !value;
    }

    cancel(): void {
        this.showAddRegion(this.showAdd);
        this.resetDepartmentForm();
        this.showAdd = false;
        this.submitted = false;
    }

    private onDepartmentEdit(model: DepartmentModel): void {
        this.form = this.setDepartmentForm(model);
        this.departmentModel = model;
        this.showAddRegion(this.showAdd);
        window.scrollTo(0,0);
        this.showAdd = true;       
    }

    private setDepartmentForm(department?: DepartmentModel): FormGroup {
        return new FormGroup({
            DepartmentId: new FormControl(department ? department.DepartmentId : 0),
            DepartmentName: new FormControl(department ? department.DepartmentName : '', [Validators.required]),
            Description: new FormControl(department ? department.Description : '', [Validators.required]),
            ContactNo: new FormControl(department ? department.ContactNo : '', [Validators.required]),
            DepartmentSpoc: new FormControl(department ? department.DepartmentSpoc : null),
            ParentDepartmentId: new FormControl((department && department.ParentDepartmentId) ? department.ParentDepartmentId : ''),
        });
    }

}