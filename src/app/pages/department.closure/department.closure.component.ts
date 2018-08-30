import {
    Component, ViewEncapsulation,
    OnInit, OnDestroy
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder, Validators
} from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { DepartmentClosureModel } from './components/department.closure.model';
import { DepartmentClosureService } from './components/department.closure.service';

import { IncidentModel } from "../incident";
import {
    ResponseModel, KeyValue, GlobalStateService,
    UtilityService, GlobalConstants
} from '../../shared';
import { Subject } from 'rxjs';

@Component({
    selector: 'department-closure-main',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./styles/department.closure.style.scss'],
    templateUrl: './views/department.closure.html'
})
export class DepartmentClosureComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    currentDepartmentId: number;
    currentIncidentId: number;
    public departmentClosureModel: DepartmentClosureModel;
    public departmentClosureModelSave: DepartmentClosureModel;
    public departmentClosureModelSubmit: DepartmentClosureModel;
    public submited: boolean = false;
    public isSubmited: boolean = false;
    public isShowPage: boolean = true;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private globalState: GlobalStateService,
        private departmentClosureService: DepartmentClosureService,
        private toastrConfig: ToastrConfig,
        private toastrService: ToastrService) {
    }

    ngOnInit(): void {
        this.submited = false;
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange,
            (model: KeyValue) => this.departmentChangeHandler(model));

        this.currentIncidentId = +UtilityService.GetFromSession("CurrentIncidentId");

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChange,
            (model: KeyValue) => this.incidentChangeHandler(model));
        this.InitialDataLoad();
    }

    public InitialDataLoad(): void {
        this.departmentClosureModel = new DepartmentClosureModel();
        this.FillFormControls(this.departmentClosureModel);
        this.isSubmited = false;
        this.initiateDepartmentClosureModel(this.currentIncidentId);
    }

    ngOnDestroy(): void {
        //this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.DepartmentChange);
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChange);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private FillFormControls(departmentClosureModel: DepartmentClosureModel): void {
        this.form = new FormGroup({
            EmergencyName: new FormControl(departmentClosureModel.EmergencyName != '' ? departmentClosureModel.EmergencyName : ''),
            EmergencyInitiationNotes: new FormControl(departmentClosureModel.EmergencyNote != '' ? departmentClosureModel.EmergencyNote : ''),
            ClosureReport: new FormControl(departmentClosureModel.ClosureReport != '' ? departmentClosureModel.ClosureReport : '', [Validators.required]),
            ClosureRemarks: new FormControl(departmentClosureModel.ClosureRemark != '' ? departmentClosureModel.ClosureRemark : '')
        });
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.currentIncidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.InitialDataLoad();
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.currentIncidentId = incident.Value;
        this.InitialDataLoad();
    }

    private initializeObject(departmentClosureModel: DepartmentClosureModel, incidentModel: IncidentModel): void {
        departmentClosureModel = new DepartmentClosureModel();
        departmentClosureModel.DepartmentClosureId = 0;
        departmentClosureModel.DepartmentId = this.currentDepartmentId;
        departmentClosureModel.IncidentId = this.currentIncidentId;
        departmentClosureModel.EmergencyName = incidentModel.EmergencyName;
        departmentClosureModel.EmergencyNote = incidentModel.Description;
        departmentClosureModel.IsSubmitted = false;
        departmentClosureModel.SubmittedBy = null;
        departmentClosureModel.SubmittedOn = null;
        departmentClosureModel.IsSaved = false;
        departmentClosureModel.SavedBy = null;
        departmentClosureModel.SavedOn = null;
        departmentClosureModel.ActiveFlag = 'Active';
    }

    private initiateDepartmentClosureModel(incidentId: number): void {
        this.departmentClosureService.GetIncidentFromIncidentId(incidentId)
            .map((incidentResult: IncidentModel) => {
                this.departmentClosureModel = new DepartmentClosureModel();
                this.departmentClosureModel.DepartmentClosureId = 0;
                this.departmentClosureModel.DepartmentId = this.currentDepartmentId;
                this.departmentClosureModel.IncidentId = this.currentIncidentId;
                this.departmentClosureModel.EmergencyName = incidentResult.EmergencyName;
                this.departmentClosureModel.EmergencyNote = incidentResult.Description;
                this.departmentClosureModel.IsSubmitted = false;
                this.departmentClosureModel.SubmittedBy = null;
                this.departmentClosureModel.SubmittedOn = null;
                this.departmentClosureModel.IsSaved = false;
                this.departmentClosureModel.SavedBy = null;
                this.departmentClosureModel.SavedOn = null;
                this.departmentClosureModel.ActiveFlag = 'Active';
                this.FillFormControls(this.departmentClosureModel);
            })
            .flatMap(_ => this.departmentClosureService.GetAllByIncidentDepartment(incidentId, this.currentDepartmentId))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((resultDepartmentClosureModel: ResponseModel<DepartmentClosureModel>) => {
                if (resultDepartmentClosureModel.Count > 0) {
                    if (resultDepartmentClosureModel.Records[0].IsSubmitted) {
                        this.isSubmited = true;
                    }
                    let departmentClosure: DepartmentClosureModel = resultDepartmentClosureModel.Records[0];
                    this.departmentClosureModel.ClosureReport = departmentClosure.ClosureReport;
                    this.departmentClosureModel.ClosureRemark = departmentClosure.ClosureRemark;
                    this.FillFormControls(this.departmentClosureModel);
                }
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    public onSave(): void {
        this.submited = true;
        if (this.form.valid) {
            this.departmentClosureService.GetAllByIncidentDepartment(this.currentIncidentId, this.currentDepartmentId)
                .takeUntil(this.ngUnsubscribe)
                .subscribe((result: ResponseModel<DepartmentClosureModel>) => {
                    if (result.Count == 0) {
                        this.departmentClosureModelSave = new DepartmentClosureModel();
                        this.departmentClosureModelSave.DepartmentClosureId = 0;
                        this.departmentClosureModelSave.ClosureReport = this.form.controls['ClosureReport'].value;
                        this.departmentClosureModelSave.ClosureRemark = this.form.controls['ClosureRemarks'].value;
                        this.departmentClosureModelSave.IncidentId = this.currentIncidentId;
                        this.departmentClosureModelSave.DepartmentId = this.currentDepartmentId;
                        this.departmentClosureModelSave.IsSaved = true;
                        this.departmentClosureModelSave.SavedBy = +UtilityService.GetFromSession('CurrentUserId');
                        this.departmentClosureModelSave.SavedOn = new Date();
                        this.departmentClosureModelSave.IsSubmitted = false;
                        this.departmentClosureModelSave.SubmittedBy = null;
                        this.departmentClosureModelSave.SubmittedOn = null;
                        this.departmentClosureModelSave.CreatedBy = +UtilityService.GetFromSession('CurrentUserId');
                        this.departmentClosureModelSave.CreatedOn = new Date();

                        this.departmentClosureService.CreateDepartmentClosure(this.departmentClosureModelSave)
                            .subscribe((resultReturn: DepartmentClosureModel) => {
                                this.toastrService.success('The Department Closure Save is performed.', 'Department Closure', this.toastrConfig);
                            }, (error: any) => {
                                console.log(`Error: ${error}`);
                                this.toastrService.error('Error Occured', 'Department Closure', this.toastrConfig);
                            });
                    }
                    else {
                        result.Records[0].ClosureReport = this.form.controls['ClosureReport'].value;
                        result.Records[0].ClosureRemark = this.form.controls['ClosureRemarks'].value;
                        result.Records[0].IncidentId = this.currentIncidentId;
                        result.Records[0].DepartmentId = this.currentDepartmentId;
                        result.Records[0].IsSaved = true;
                        result.Records[0].SavedBy = +UtilityService.GetFromSession('CurrentUserId');
                        result.Records[0].SavedOn = new Date();
                        result.Records[0].CreatedBy = +UtilityService.GetFromSession('CurrentUserId');
                        result.Records[0].CreatedOn = new Date();
                        delete result.Records[0].Department;

                        this.departmentClosureService.UpdateDepartmentClosure(result.Records[0])
                            .subscribe((resultReturn: DepartmentClosureModel) => {
                                this.toastrService.success('The Department Closure Save is performed.', 'Department Closure', this.toastrConfig);
                            }, (error: any) => {
                                console.log(`Error: ${error}`);
                                this.toastrService.error('Error Occured', 'Department Closure', this.toastrConfig);
                            });
                    }
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
    }

    public onSubmit(): void {
        this.submited = true;
        if (this.form.valid) {
            this.departmentClosureService.CheckPendingCheckListOrDemandForIncidentAndDepartment
                (this.currentIncidentId, this.currentDepartmentId, (item: boolean) => {
                    if (item) {
                        this.toastrService.warning('You can not submit the closure report since you have pending checklist or request.',
                            'Department Closure', this.toastrConfig);
                        return false;
                    }
                    else {
                        this.departmentClosureService.GetAllByIncidentDepartment(this.currentIncidentId, this.currentDepartmentId)
                            .takeUntil(this.ngUnsubscribe)
                            .subscribe((result: ResponseModel<DepartmentClosureModel>) => {
                                if (result.Count == 0) {
                                    this.departmentClosureModelSubmit = new DepartmentClosureModel();
                                    this.departmentClosureModelSubmit.DepartmentClosureId = 0;
                                    this.departmentClosureModelSubmit.ClosureReport = this.form.controls['ClosureReport'].value;
                                    this.departmentClosureModelSubmit.ClosureRemark = this.form.controls['ClosureRemarks'].value;
                                    this.departmentClosureModelSubmit.IncidentId = this.currentIncidentId;
                                    this.departmentClosureModelSubmit.DepartmentId = this.currentDepartmentId;
                                    this.departmentClosureModelSubmit.IsSaved = true;

                                    this.departmentClosureModelSubmit.SavedBy = +UtilityService.GetFromSession('CurrentUserId');
                                    this.departmentClosureModelSubmit.SavedOn = new Date();
                                    this.departmentClosureModelSubmit.IsSubmitted = true;
                                    this.departmentClosureModelSubmit.SubmittedBy = +UtilityService.GetFromSession('CurrentUserId');
                                    this.departmentClosureModelSubmit.SubmittedOn = new Date();
                                    this.departmentClosureModelSubmit.CreatedBy = +UtilityService.GetFromSession('CurrentUserId');
                                    this.departmentClosureModelSubmit.CreatedOn = new Date();

                                    this.departmentClosureService.CreateDepartmentClosure(this.departmentClosureModelSubmit)
                                        .subscribe((resultReturn: DepartmentClosureModel) => {
                                            this.isSubmited = true;
                                            this.toastrService.success('The Department Closure Submit is performed.', 'Department Closure', this.toastrConfig);
                                        }, (error: any) => {
                                            console.log(`Error: ${error}`);
                                            this.toastrService.error('Error Occured', 'Department Closure', this.toastrConfig);
                                        });
                                }
                                else {
                                    result.Records[0].ClosureReport = this.form.controls['ClosureReport'].value;
                                    result.Records[0].ClosureRemark = this.form.controls['ClosureRemarks'].value;
                                    result.Records[0].IncidentId = this.currentIncidentId;
                                    result.Records[0].DepartmentId = this.currentDepartmentId;
                                    result.Records[0].IsSaved = true;
                                    result.Records[0].SavedBy = +UtilityService.GetFromSession('CurrentUserId');
                                    result.Records[0].SavedOn = new Date();
                                    result.Records[0].IsSubmitted = true;
                                    result.Records[0].SubmittedBy = +UtilityService.GetFromSession('CurrentUserId');
                                    result.Records[0].SubmittedOn = new Date();
                                    result.Records[0].CreatedBy = +UtilityService.GetFromSession('CurrentUserId');
                                    result.Records[0].CreatedOn = new Date();
                                    delete result.Records[0].Department;

                                    this.departmentClosureService.UpdateDepartmentClosure(result.Records[0])
                                        .subscribe((resultReturn: DepartmentClosureModel) => {
                                            this.isSubmited = true;
                                            this.toastrService.success('The Department Closure Submit is performed.', 'Department Closure', this.toastrConfig);
                                        }, (error: any) => {
                                            console.log(`Error: ${error}`);
                                            this.toastrService.error('Error Occured', 'Department Closure', this.toastrConfig);
                                        });
                                }
                            });
                    }
                });
        }

    }

    private formReset(): void {
        this.submited = false;
        this.form.controls["ClosureReport"].reset({ value: '' });
        this.form.controls["ClosureRemarks"].reset({ value: '' });
    }
}
