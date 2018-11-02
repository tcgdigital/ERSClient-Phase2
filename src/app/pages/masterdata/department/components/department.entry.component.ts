import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import {
    FormGroup,
    FormControl,
    Validators
} from '@angular/forms';
import { Observable, Subject } from 'rxjs/Rx';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

import { DepartmentService } from './department.service';
import { DepartmentModel } from './department.model';
import { UserProfileService, UserProfileModel } from '../../userprofile';
import {
    ResponseModel, UtilityService, GlobalConstants,
    DataExchangeService, BaseModel, AuthModel, KeyValue, GlobalStateService
} from '../../../../shared';

@Component({
    selector: 'dept-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/department.entry.view.html'
})
export class DepartmentEntryComponent implements OnInit, OnDestroy {
    form: FormGroup;
    users: UserProfileModel[] = [];
    parentDepartments: DepartmentModel[] = [];
    showAdd: boolean = false;
    departmentModel: DepartmentModel;
    credential: AuthModel;
    submitted: boolean = false;
    public showAddText: string = 'ADD DEPARTMENT';
    private ngUnsubscribe: Subject<any> = new Subject<any>();
    public isShow: boolean = true;
    public currentDepartmentId: number;

    /**
     *Creates an instance of DepartmentEntryComponent.
     * @param {DepartmentService} departmentService
     * @param {UserProfileService} userService
     * @param {DataExchangeService<DepartmentModel>} dataExchange
     * @param {ToastrService} toastrService
     * @param {ToastrConfig} toastrConfig
     * @memberof DepartmentEntryComponent
     */
    constructor(private departmentService: DepartmentService,
        private userService: UserProfileService,
        private dataExchange: DataExchangeService<DepartmentModel>,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private globalState: GlobalStateService
    ) { }

    mergeResponses(): void {
        const activeUsers: Observable<ResponseModel<UserProfileModel>>
            = this.userService.GetAllActiveWithContact();

        const parentDepts: Observable<ResponseModel<DepartmentModel>>
            = this.departmentService.GetAll();

        Observable.merge(activeUsers, parentDepts)
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<BaseModel>) => {
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
            }, (error) => {
                console.log(error);
            }, () => {
                this.form = this.setDepartmentForm();
                this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentModelEdited,
                    (model: DepartmentModel) => this.onDepartmentEdit(model));
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
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange,
            (model: KeyValue) => { this.currentDepartmentId = model.Value; });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
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
                    (x: DepartmentModel) => x.DepartmentId,
                    (x: DepartmentModel) => x.DepartmentName,
                    (x: DepartmentModel) => x.Description,
                    (x: DepartmentModel) => x.ContactNo,
                    (x: DepartmentModel) => x.DepartmentSpoc,
                    (x: DepartmentModel) => x.ParentDepartmentId);

                this.departmentModel.ContactNo = this.departmentModel.ContactNo.toString().replace(/^\D+/g, '');
                this.departmentModel.CreatedBy = +this.credential.UserId;
                this.setparentDepartmentAndDeptSpoc();

                this.departmentService.Create(this.departmentModel)
                    .subscribe((response: DepartmentModel) => {
                        this.toastrService.success(`Department Saved Successfully. ${GlobalConstants.departmentAndFunctionalityReloginMessage}`, 'Success', this.toastrConfig);
                        this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.DepartmentSavedOrEdited, response);
                        this.resetDepartmentForm();
                        this.mergeResponses();
                        this.showAddRegion(this.showAdd);
                        this.showAdd = false;
                        this.submitted = false;
                    }, (error: any) => {
                        console.log(`Error: ${error.message}`);
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
                this.setparentDepartmentAndDeptSpoc();

                if (this.departmentModel.ContactNo) {
                    this.departmentModel.ContactNo = this.departmentModel.ContactNo.toString().replace(/^\D+/g, '');
                }

                this.departmentService.Update(this.departmentModel, this.departmentModel.DepartmentId)
                    .subscribe((response: DepartmentModel) => {
                        this.toastrService.success(`Department updated Successfully.  ${GlobalConstants.departmentAndFunctionalityReloginMessage}`, 'Success', this.toastrConfig);
                        this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.DepartmentSavedOrEdited, response);
                        this.resetDepartmentForm();
                        this.mergeResponses();
                        this.showAddRegion(this.showAdd);
                        this.showAdd = false;
                        this.submitted = false;
                    }, (error: any) => {
                        console.log(`Error: ${error.message}`);
                    });
            }
        }
    }

    setparentDepartmentAndDeptSpoc(): void {
        if (this.form.controls['ParentDepartmentId'].value == '') {
            this.departmentModel.ParentDepartmentId = null;
        }
        else {
            this.departmentModel.ParentDepartmentId = +this.form.controls['ParentDepartmentId'].value;
        }
        if (this.form.controls["DepartmentSpoc"].value == '') {
            this.departmentModel.DepartmentSpoc = null;
        }
        else {
            this.departmentModel.DepartmentSpoc = +this.form.controls["DepartmentSpoc"].value;
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

        window.setInterval(() => {
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
        window.scrollTo(0, 0);
        this.showAdd = true;
    }

    private setDepartmentForm(department?: DepartmentModel): FormGroup {
        return new FormGroup({
            DepartmentId: new FormControl(department ? department.DepartmentId : 0),
            DepartmentName: new FormControl(department ? department.DepartmentName : '', [Validators.required]),
            Description: new FormControl(department ? department.Description : '', [Validators.required]),
            ContactNo: new FormControl(department ? department.ContactNo : '', [Validators.required]),
            DepartmentSpoc: new FormControl((department && department.DepartmentSpoc) ? department.DepartmentSpoc : ''),
            ParentDepartmentId: new FormControl((department && department.ParentDepartmentId) ? department.ParentDepartmentId : '')
        });
    }

}