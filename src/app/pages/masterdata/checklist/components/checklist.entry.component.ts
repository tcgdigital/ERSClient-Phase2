import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
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

import { ChecklistModel } from './checklist.model';
import { DepartmentModel, DepartmentService } from '../../department';
import { EmergencyTypeModel, EmergencyTypeService } from '../../emergencytype';
import { ChecklistService } from './checklist.service';
import {
    ResponseModel, DataExchangeService, BaseModel,
    UtilityService, GlobalStateService, KeyValue, AuthModel
} from '../../../../shared';

@Component({
    selector: 'checklist-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/checklist.entry.view.html'
})
export class ChecklistEntryComponent implements OnInit {
    public form: FormGroup;

    checkListModel: ChecklistModel;
    checkListModelEdit: ChecklistModel;
    date: Date = new Date();
    activeCheckLists: ChecklistModel[] = [];
    activeDepartments: DepartmentModel[] = [];
    activeEmergencyTypes: EmergencyTypeModel[] = [];
    showAdd: boolean = true;
    buttonValue: string = '';
    currentDepartmentId: number;
    currentDepartmentName: string;
    credential: AuthModel;

    constructor(formBuilder: FormBuilder,
        private departmentService: DepartmentService,
        private checkListService: ChecklistService,
        private emergencyTypeService: EmergencyTypeService,
        private dataExchange: DataExchangeService<ChecklistModel>,
        private globalState: GlobalStateService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) {
        this.showAdd = false;
        this.buttonValue = 'Add Checklist';
        this.checkListModel = new ChecklistModel();
        this.checkListModelEdit = new ChecklistModel();
    }

    mergeResponses(departmentId): void {
        const allChecklists: Observable<ResponseModel<ChecklistModel>>
            = this.checkListService.GetAllByDepartment(departmentId);

        const activeDepartments: Observable<ResponseModel<DepartmentModel>>
            = this.departmentService.GetAll();

        const activeEmergencyTypes: Observable<ResponseModel<EmergencyTypeModel>>
            = this.emergencyTypeService.GetAll();

        Observable.merge(allChecklists, activeDepartments, activeEmergencyTypes)
            .subscribe(
            (response: ResponseModel<BaseModel>) => {
                if (response.Records.length > 0 && Object.keys(response.Records[0]).some((x) => x === 'CheckListId')) {
                    this.activeCheckLists = response.Records as ChecklistModel[];
                    this.checkListModel.ParentCheckListId = this.activeCheckLists[0].CheckListId;

                } else if (response.Records.length > 0 && Object.keys(response.Records[0]).some((x) => x === 'DepartmentId')) {
                    this.activeDepartments = response.Records as DepartmentModel[];
                    this.checkListModel.DepartmentId = this.activeDepartments[0].DepartmentId;

                } else if (response.Records.length > 0 && Object.keys(response.Records[0]).some((x) => x === 'EmergencyTypeId')) {
                    this.activeEmergencyTypes = response.Records as EmergencyTypeModel[];
                    this.checkListModel.EmergencyTypeId = this.activeEmergencyTypes[0].EmergencyTypeId;
                }
            },
            (error) => { console.log(error); },
            () => {
                this.currentDepartmentName = this.activeDepartments.find((x) => {
                    return x.DepartmentId === this.currentDepartmentId;
                }).DepartmentName;
                this.form = this.resetCheckListForm();
                this.initiateCheckListModel();
                this.dataExchange.Subscribe('checklistModelEdited', (model) => this.onCheckListEditSuccess(model));
            }
            );
    }

    ngOnInit(): void {
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.mergeResponses(this.currentDepartmentId);
        this.credential = UtilityService.getCredentialDetails();
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe('departmentChange');
        this.dataExchange.Unsubscribe('checklistModelEdited');
    }

    initiateCheckListModel(): void {
        this.checkListModel = new ChecklistModel();
        this.checkListModel.ActiveFlag = 'Active';
        this.checkListModel.CreatedBy = +this.credential.UserId;
        this.checkListModel.CreatedOn = this.date;
        this.checkListModel.CheckListId = 0;
    }

    formControlDirtyCheck() {
        this.checkListModelEdit = new ChecklistModel();
        this.checkListModelEdit.CheckListId = this.form.controls['CheckListId'].value;

        if (this.form.controls['CheckListDetails'].touched) {
            this.checkListModelEdit.CheckListDetails = this.form.controls['CheckListDetails'].value;
        }
        if (this.form.controls['ParentCheckListId'].touched) {
            this.checkListModelEdit.ParentCheckListId = this.form.controls['ParentCheckListId'].value;
        }
        if (this.form.controls['Duration'].touched) {
            this.checkListModelEdit.Duration = this.form.controls['Duration'].value;
        }
        if (this.form.controls['DepartmentId'].touched) {
            this.checkListModelEdit.DepartmentId = this.form.controls['DepartmentId'].value;
        }
        if (this.form.controls['URL'].touched) {
            this.checkListModelEdit.URL = this.form.controls['URL'].value;
        }
        if (this.form.controls['EmergencyTypeId'].touched) {
            this.checkListModelEdit.EmergencyTypeId = this.form.controls['EmergencyTypeId'].value;
        }
        if (this.form.controls['Sequence'].touched) {
            this.checkListModelEdit.Sequence = this.form.controls['Sequence'].value;
        }
    }

    onSubmit(values: object): void {
        if (this.form.valid) {
            if (this.checkListModel.CheckListId === 0) {// ADD REGION
                this.checkListModel.CheckListDetails = this.form.controls['CheckListDetails'].value;
                this.checkListModel.ParentCheckListId = this.form.controls['ParentCheckListId'].value;
                this.checkListModel.Duration = this.form.controls['Duration'].value;
                this.checkListModel.DepartmentId = this.form.controls['DepartmentId'].value;
                this.checkListModel.URL = this.form.controls['URL'].value;
                this.checkListModel.EmergencyTypeId = this.form.controls['EmergencyTypeId'].value;
                this.checkListModel.Sequence = this.form.controls['Sequence'].value;
                delete this.checkListModel['Active'];

                let CheckList_Code = '';
                const dep = this.currentDepartmentName;
                CheckList_Code = CheckList_Code + dep.trim();

                if (this.checkListModel.ParentCheckListId != null) {
                    this.checkListService.GetParentChecklistCode(this.checkListModel.ParentCheckListId)
                        .subscribe((response: ResponseModel<ChecklistModel>) => {
                            CheckList_Code = CheckList_Code + '_' + response.Records[0].CheckListCode;
                            const d = new Date();
                            const time = d.getTime();
                            const timestring = time.toString();
                            const n = timestring.substr(timestring.length - 5);

                            CheckList_Code = CheckList_Code + '_' + n;
                            this.checkListModel.CheckListCode = CheckList_Code;
                            this.createChecklist(this.checkListModel);
                        });
                }
                else {
                    this.checkListModel.CheckListCode = CheckList_Code;
                    this.createChecklist(this.checkListModel);
                }
            }
            else {// EDIT REGION
                if (this.form.dirty) {
                    this.formControlDirtyCheck();
                    this.checkListService.Update(this.checkListModelEdit)
                        .subscribe((response: ChecklistModel) => {
                            this.toastrService.success('Checklist Edited Successfully.', 'Success', this.toastrConfig);
                            this.initiateCheckListModel();
                            this.form = this.resetCheckListForm();
                            this.dataExchange.Publish('checkListListReload', response);
                            this.showAdd = false;
                        }, (error: any) => {
                            console.log(`Error: ${error}`);
                        });
                }
            }
        }
    }

    cancel(): void {
        this.resetCheckListForm();
        this.showAdd = false;
    }

    createChecklist(checklistMode: ChecklistModel): void {
        this.checkListService.Create(this.checkListModel)
            .subscribe((response: ChecklistModel) => {
                this.toastrService.success('Checklist Created Successfully.', 'Success', this.toastrConfig);
                this.dataExchange.Publish('checkListModelSaved', response);
                this.form = this.resetCheckListForm();
                this.showAdd = false;
                this.initiateCheckListModel();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    onCheckListEditSuccess(data: ChecklistModel): void {
        this.showAdd = true;
        this.initiateCheckListModel();
        this.checkListModel = data;
        this.form = this.resetCheckListForm(this.checkListModel);
    }

    showAddRegion(): void {
        this.form = this.resetCheckListForm();
        this.showAdd = true;
    }

    private resetCheckListForm(checkList?: ChecklistModel): FormGroup {
        return new FormGroup({
            CheckListId: new FormControl(checkList ? checkList.CheckListId : 0),
            CheckListDetails: new FormControl(checkList ? checkList.CheckListDetails : '', [Validators.required]),
            ParentCheckListId: new FormControl(checkList ? checkList.ParentCheckListId : '', [Validators.required]),
            Duration: new FormControl(checkList ? checkList.Duration : '', [Validators.required]),
            DepartmentId: new FormControl(checkList ? checkList.DepartmentId : '', [Validators.required]),
            URL: new FormControl(checkList ? checkList.URL : '', [Validators.required]),
            EmergencyTypeId: new FormControl(checkList ? checkList.EmergencyTypeId : '', [Validators.required]),
            Sequence: new FormControl(checkList ? checkList.Sequence : '', [Validators.required])
        });
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.mergeResponses(this.currentDepartmentId);
    }
}


