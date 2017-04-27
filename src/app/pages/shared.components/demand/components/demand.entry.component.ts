import {
    Component, ViewEncapsulation, Output,
    EventEmitter, OnInit, OnDestroy, ViewChild
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';


import { DemandService } from './demand.service';
import { DemandTrailService } from './demandtrail.service';
import { DemandModel } from './demand.model';
import { DemandTrailModel } from './demand.trail.model';
import { DemandTypeService, DemandTypeModel } from '../../../masterdata/demandtype';
import { DepartmentService, DepartmentModel } from '../../../masterdata/department';
import { PageService, PageModel } from '../../../masterdata/department.functionality';
import {
    AffectedObjectsService, AffectedObjectsToView, AffectedPeopleService,
    AffectedPeopleToView, InvolvePartyModel, CommunicationLogModel
} from '../../../shared.components';
import { InvolvePartyService } from '../../involveparties';
import { CallerService, CallerModel } from '../../caller';
import {
    ResponseModel, DataExchangeService,
    GlobalConstants, KeyValue, AutocompleteComponent,
    UtilityService, GlobalStateService, AuthModel
} from '../../../../shared';
import { ModalDirective } from 'ng2-bootstrap/modal';


@Component({
    selector: 'demand-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/demand.entry.view.html'
})
export class DemandEntryComponent implements OnInit, OnDestroy {
    @ViewChild('childModal') public childModal: ModalDirective;

    public form: FormGroup;
    demandModel: DemandModel = new DemandModel();
    demandTypes: DemandTypeModel[];
    date: Date = new Date();
    Action: string;
    priorities: any[] = GlobalConstants.Priority;
    requesterTypes: any[] = GlobalConstants.RequesterType;
    filtereddepartments: DepartmentModel[] = [];
    affectedPeople: AffectedPeopleToView[];
    affectedObjects: AffectedObjectsToView[];
    pdas: Array<KeyValue> = [];
    awbs: Array<KeyValue> = [];
    currentIncidentId: number;
    currentDepartmentId: number;
    parentDeptId: number = null;
    currentDepartmentName: string = "Command Centre";
    communicationLogs: CommunicationLogModel[];
    communicationLog: CommunicationLogModel;
    showAdd: Boolean = true;
    demandTrail: DemandTrailModel;
    demandTrails: DemandTrailModel[];
    departments: DepartmentModel[];
    buttonValue: String = "";
    createdBy: number;
    demandModelEdit: DemandModel;
    credentialName: string;
    caller: CallerModel;
    credential: AuthModel;

    /**
     * Creates an instance of DemandEntryComponent.
     * @param {DemandService} demandService 
     * @param {DemandTypeService} demandTypeService 
     * @param {DepartmentService} departmentService 
     * @param {PageService} pageService 
     * @param {DemandTrailService} demandTrailService 
     * @param {CallerService} callerService 
     * @param {InvolvePartyService} involvedPartyService 
     * @param {AffectedObjectsService} affectedObjectsService 
     * @param {AffectedPeopleService} affectedPeopleService 
     * @param {GlobalStateService} globalState 
     * @param {DataExchangeService<number>} dataExchange 
     * 
     * @memberOf DemandEntryComponent
     */
    constructor(private demandService: DemandService,
        private demandTypeService: DemandTypeService,
        private departmentService: DepartmentService,
        private pageService: PageService,
        private demandTrailService: DemandTrailService,
        private callerService: CallerService,
        private involvedPartyService: InvolvePartyService,
        private affectedObjectsService: AffectedObjectsService,
        private affectedPeopleService: AffectedPeopleService,
        private globalState: GlobalStateService,
        private dataExchange: DataExchangeService<number>,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) {
        this.showAdd = false;
        this.buttonValue = "Create Demand";
        // this.createdBy = 2;
        this.departments = [];
        // this.credentialName = "Anwesha Ray";
    }

    getDemandType(): void {
        this.demandTypeService.GetAll()
            .subscribe((response: ResponseModel<DemandTypeModel>) => {
                this.demandTypes = response.Records;
                this.demandModel.DemandTypeId = (this.demandModel.DemandTypeId == 0)
                    ? this.demandTypes[0].DemandTypeId
                    : this.demandModel.DemandTypeId;
            });
    };

    getPageSpecifiedDepartments(): void {
        this.pageService.GetDepartmentsByPageCode("ViewDepartmentSpecificDemands")
            .subscribe((response: ResponseModel<PageModel>) => {
                let pagePermissions = UtilityService.pluck(response.Records[0], ['PagePermissions'])[0];
                pagePermissions.forEach(x => {
                    this.departments.push(UtilityService.pluck(x, ['Department'])[0]);
                });
                this.demandModel.TargetDepartmentId = (this.demandModel.TargetDepartmentId == 0)
                    ? this.departments[0].DepartmentId
                    : this.demandModel.TargetDepartmentId;
            });
    };

    getAllDepartments(): void {
        this.departmentService.GetAll()
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                this.departments = response.Records;
            }, (error: any) => {
                console.log("error:  " + error);
            });
    }

    createDemandTrailModel(demand: DemandModel, demandForAnswer: DemandModel, flag): DemandTrailModel[] {
        let demandTrails: DemandTrailModel[] = [];
        let demandTrail: DemandTrailModel = new DemandTrailModel();
        let editedFields = '';
        let answer = '';

        demandTrail.Answers = "";
        demandTrail.IncidentId = demand.IncidentId;
        demandTrail.DemandTypeId = demand.DemandTypeId;
        demandTrail.DemandCode = demand.DemandCode;
        demandTrail.ScheduleTime = demand.ScheduleTime;
        demandTrail.ContactNumber = demand.ContactNumber;
        demandTrail.Priority = demand.Priority;
        demandTrail.RequiredLocation = demand.RequiredLocation;
        demandTrail.RequesterName = demand.RequestedBy;
        demandTrail.RequesterDepartmentName = this.departments.find(x => { return x.DepartmentId == demand.RequesterDepartmentId; }) ?
            this.departments.find(x => { return x.DepartmentId == demand.RequesterDepartmentId; }).DepartmentName : null;
        demandTrail.RequesterParentDepartmentName = this.departments.find(x => { return x.DepartmentId == demand.RequesterParentDepartmentId; }) ?
            this.departments.find(x => { return x.DepartmentId == demand.RequesterParentDepartmentId; }).DepartmentName : null;
        demandTrail.TargetDepartmentName = this.departments.find(x => { return x.DepartmentId == demand.TargetDepartmentId; }).DepartmentName;
        demandTrail.ApproverDepartmentName = this.departments.find(x => { return x.DepartmentId == demand.ApproverDepartmentId; }) ?
            this.departments.find(x => { return x.DepartmentId == demand.ApproverDepartmentId; }).DepartmentName : null;
        demandTrail.RequesterType = demand.RequesterType;
        demandTrail.DemandDesc = demand.DemandDesc;
        demandTrail.IsApproved = demand.IsApproved;
        demandTrail.ApprovedDt = demand.ApprovedDt;
        demandTrail.IsCompleted = false;
        demandTrail.ScheduledClose = null;
        demandTrail.IsClosed = false;
        demandTrail.ClosedOn = null;
        demandTrail.IsRejected = false;
        demandTrail.RejectedDate = null;
        demandTrail.DemandStatusDescription = demand.DemandStatusDescription;
        demandTrail.Remarks = demand.Remarks;
        demandTrail.ActiveFlag = "Active";
        demandTrail.CreatedBy = demand.CreatedBy ? demand.CreatedBy : this.createdBy;
        demandTrail.CreatedOn = demand.CreatedOn ? demand.CreatedOn : new Date();

        var TargetDepartmentName = this.departments.find(x => { return x.DepartmentId == demandForAnswer.TargetDepartmentId; }) ?
            this.departments.find(x => { return x.DepartmentId == demandForAnswer.TargetDepartmentId; }).DepartmentName : undefined;
        let date = new Date();
        if (flag) {
            answer = '<div><p>' + demand.DemandStatusDescription + '   <strong>Date :</strong>  ' + date.toLocaleString() + '  </p><div>';
        }
        else {
            answer = '<div><p> Request Edited By ' + demandTrail.RequesterDepartmentName + '  <strong>Date :</strong>  ' + date.toLocaleString() + '  </p><div>';
        }
        if (!flag && (demandForAnswer != undefined)) {

            if (demandForAnswer.Priority) {
                editedFields = editedFields + '<strong>Priority</strong> : ' + demandForAnswer.Priority + '  ';
            }
            if (demandForAnswer.DemandDesc) {
                editedFields = editedFields + '<strong>Description</strong> : ' + demandForAnswer.DemandDesc + '  ';
            }
            if (demandForAnswer.RequesterType) {
                editedFields = editedFields + '<strong>Requester Type</strong> : ' + demandForAnswer.RequesterType + '  ';
            }
            if (demandForAnswer.TargetDepartmentId) {
                editedFields = editedFields + '<strong>Target Department</strong> : ' + TargetDepartmentName + '  ';
            }
            if (demandForAnswer.ContactNumber) {
                editedFields = editedFields + '<strong>Requester Contact Number</strong> : ' + demandForAnswer.ContactNumber + '  ';
            }
            if (demandForAnswer.ScheduleTime) {
                let minutesInt = parseInt(demandForAnswer.ScheduleTime);
                let d = new Date(demand.CreatedOn);
                d.setMinutes(d.getMinutes() + minutesInt);
                let editedDate = new Date(d);
                editedFields = editedFields + '<strong>Expected Resolution Time</strong> : ' + editedDate + '  ';
            }
            if (demandForAnswer.RequiredLocation) {
                editedFields = editedFields + '<strong>Required At Location</strong> : ' + demandForAnswer.RequiredLocation + '  ';
            }
        }
        answer = answer + editedFields + '</p><div>';
        demandTrail.Answers = answer;
        if ((!editedFields && flag) || (!flag && editedFields)) {
            demandTrails.push(demandTrail);
        }
        return demandTrails;
    };

    getPassengersCrews(currentIncident): void {
        this.involvedPartyService.GetFilterByIncidentId(currentIncident)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedPeople = this.affectedPeopleService.FlattenAffectedPeople(response.Records[0]);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    getCargo(currentIncident): void {
        this.affectedObjectsService.GetFilterByIncidentId(currentIncident)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedObjects = this.affectedObjectsService.FlattenAffactedObjects(response.Records[0]);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    ChangeAffectedPeople(): void {

        if (this.demandModel.AffectedPersonId != 0) {
            this.form.controls["AffectedObjectId"].reset({ value: 0, disabled: true });
            this.demandModel.PDATicketNumber = this.affectedPeople.find(x => x.AffectedPersonId == this.demandModel.AffectedPersonId).TicketNumber;
            this.form.controls["PDATicketNumber"].reset({ value: this.demandModel.PDATicketNumber, disabled: true });
        }
        else {
            this.form.controls["AffectedObjectId"].reset({ value: 0, disabled: false });
            this.form.controls["PDATicketNumber"].reset({ value: "", disabled: true });
        }
    };

    ChangeAffectedObjects(): void {
        if (this.demandModel.AffectedObjectId != 0) {
            this.form.controls["AffectedPersonId"].reset({ value: 0, disabled: true });
            this.demandModel.PDATicketNumber = this.affectedObjects.find(x => x.AffectedObjectId == this.demandModel.AffectedObjectId).TicketNumber;
            this.form.controls["PDATicketNumber"].reset({ value: this.demandModel.PDATicketNumber, disabled: true });

        }
        else {
            this.form.controls["AffectedPersonId"].reset({ value: 0, disabled: false });
            this.form.controls["PDATicketNumber"].reset({ value: "", disabled: true });
        }
    };

    showAddRegion(ShowAdd: Boolean): void {
        this.showAdd = true;
        this.buttonValue = "Create Demand";
        this.childModal.show();

    };

    setModelFormGroup(model: DemandModel, ...params: ((entity: DemandModel) => any)[]): void {
        let paramNames: string[] = [];
        if (params.length > 0) {
            params.forEach((x: Function) => {
                paramNames.push(UtilityService.getReturnType(x)[0]);
            });

            if (paramNames.length > 0) {
                paramNames.forEach((x: string) => {
                    this.form.controls[x].reset({ value: model[x], disabled: false });
                })
            }
        }
    };


    setModelForUpdate(id) {
        debugger;
        this.demandService.GetByDemandId(id)
            .subscribe((response: ResponseModel<DemandModel>) => {
                this.demandModel = response.Records[0];
                this.setModelFormGroup(response.Records[0], x => x.DemandId, x => x.DemandTypeId, x => x.Priority, x => x.DemandDesc
                    , x => x.RequestedBy, x => x.RequesterType, x => x.PDATicketNumber, x => x.TargetDepartmentId, x => x.ContactNumber
                    , x => x.ScheduleTime, x => x.RequiredLocation);
                this.caller = this.demandModel.Caller || new CallerModel();
                this.showAdd = true;
                this.buttonValue = "Create Demand";
                this.childModal.show();
                this.form.controls["PDATicketNumber"].reset({ value: this.demandModel.PDATicketNumber, disabled: true });
                this.form.controls["AffectedPersonId"].reset({ value: this.demandModel.AffectedPersonId, disabled: true });
                this.form.controls["AffectedObjectId"].reset({ value: this.demandModel.AffectedObjectId, disabled: true });
                this.form.controls["DemandTypeId"].reset({ value: this.demandModel.DemandTypeId, disabled: true });

            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    cancelModal(): void {
        this.childModal.hide();
    }

    ngOnInit(): any {
        this.currentIncidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.credential = UtilityService.getCredentialDetails();
        this.createdBy = +this.credential.UserId;
        this.credentialName = this.credential.UserName;
        this.getDemandType();
        this.getPageSpecifiedDepartments();
        this.getAllDepartments();
        this.getPassengersCrews(this.currentIncidentId);
        this.getCargo(this.currentIncidentId);
        this.initializeForm();
        this.getDepartmentNameAndParentDepartment(this.currentDepartmentId);
        this.demandModel.DemandId = 0;
        this.demandModel.IncidentId = this.currentIncidentId;
        this.demandModel.RequesterDepartmentId = this.currentDepartmentId;
        this.demandModel.AffectedObjectId = 0;
        this.demandModel.AffectedPersonId = 0;
        this.demandModel.DemandTypeId = 0;
        this.demandModel.Priority = "0";
        this.demandModel.RequesterType = "0";
        this.demandModel.TargetDepartmentId = 0;
        this.demandModel.Caller = new CallerModel();
        this.demandModel.RequestedBy = this.credentialName;
        this.demandModel.Caller.CallerName = this.credentialName;
        this.Action = "Save";

        this.dataExchange.Subscribe("OnDemandUpdate", model => this.setModelForUpdate(model));
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    };

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getPassengersCrews(this.currentIncidentId);
        this.getCargo(this.currentIncidentId);
    };

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getDepartmentNameAndParentDepartment(this.currentDepartmentId);
    };

    getDepartmentNameAndParentDepartment(departmentId): void {
        this.departmentService.Get(departmentId)
            .subscribe((response: DepartmentModel) => {
                this.currentDepartmentName = response.DepartmentName;
                this.parentDeptId = response.ParentDepartmentId;
                this.demandModel.RequesterParentDepartmentId = this.parentDeptId;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    SetCommunicationLog(demand: DemandModel): CommunicationLogModel[] {
        this.communicationLogs = new Array<CommunicationLogModel>();
        this.communicationLog = new CommunicationLogModel();
        this.communicationLog.InteractionDetailsId = 0;
        this.communicationLog.Queries = demand.DemandDesc;
        this.communicationLog.Answers = demand.DemandStatusDescription + ", "
            + this.demandTypes.find(x => x.DemandTypeId == demand.DemandTypeId).DemandTypeName + " request for " +
            this.departments.find(x => x.DepartmentId == demand.TargetDepartmentId).DepartmentName
            + ". Request Details : " + demand.DemandDesc + ". " + "created with status " + demand.ActiveFlag + ".";
        this.communicationLog.RequesterName = demand.RequestedBy;
        this.communicationLog.RequesterDepartment = this.departments.find(x => x.DepartmentId == demand.TargetDepartmentId).DepartmentName;
        this.communicationLog.RequesterType = "Request";
        this.communicationLog.DemandId = demand.DemandId;
        this.communicationLog.InteractionDetailsType = GlobalConstants.InteractionDetailsTypeDemand;
        if (demand.AffectedPersonId != null) {
            this.communicationLog.AffectedPersonId = demand.AffectedPersonId;
        }
        else {
            delete this.communicationLog.AffectedPersonId;
        }
        if (demand.AffectedObjectId != null) {
            this.communicationLog.AffectedObjectId = demand.AffectedObjectId;
        }
        else {
            delete this.communicationLog.AffectedObjectId;
        }
        this.communicationLogs.push(this.communicationLog);
        return this.communicationLogs;
    };

    initializeForm(): void {
        this.form = new FormGroup({
            DemandId: new FormControl(0),
            DemandTypeId: new FormControl(0),
            Priority: new FormControl(0),
            DemandDesc: new FormControl(),
            RequestedBy: new FormControl({ value: this.credentialName, disabled: false }),
            RequesterType: new FormControl(0),
            PDATicketNumber: new FormControl({ value: '', disabled: true }),
            TargetDepartmentId: new FormControl(0),
            ContactNumber: new FormControl(),
            ScheduleTime: new FormControl(),
            RequiredLocation: new FormControl(),
            AffectedPersonId: new FormControl(0),
            AffectedObjectId: new FormControl(0)
        });

    };

    formControlDirtyCheck(): void {
        this.demandModelEdit = new DemandModel();
        delete this.demandModelEdit.ActiveFlag;
        delete this.demandModelEdit.CreatedBy;
        delete this.demandModelEdit.CreatedOn;

        // this.caller = new CallerModel();
        delete this.caller.ActiveFlag;
        delete this.caller.CreatedBy;
        delete this.caller.CreatedOn;
        this.demandModelEdit.DemandId = this.form.controls['DemandId'].value;

        if (this.form.controls['Priority'].touched) {
            this.demandModelEdit.Priority = this.form.controls['Priority'].value;
        }
        if (this.form.controls['DemandDesc'].touched) {
            this.demandModelEdit.DemandDesc = this.form.controls['DemandDesc'].value;
        }
        if (this.form.controls['RequestedBy'].touched) {
            this.caller.CallerName = this.form.controls['RequestedBy'].value;
        }
        if (this.form.controls['RequesterType'].touched) {
            this.demandModelEdit.RequesterType = this.form.controls['RequesterType'].value;
        }
        if (this.form.controls['TargetDepartmentId'].touched) {
            this.demandModelEdit.TargetDepartmentId = this.form.controls['TargetDepartmentId'].value;
        }
        if (this.form.controls['ContactNumber'].touched) {
            this.demandModelEdit.ContactNumber = this.form.controls['ContactNumber'].value;
            this.caller.ContactNumber = this.form.controls['ContactNumber'].value;
        }
        if (this.form.controls['RequiredLocation'].touched) {
            this.demandModelEdit.RequiredLocation = this.form.controls['RequiredLocation'].value;
        }
        if (this.form.controls['ScheduleTime'].touched) {
            this.demandModelEdit.ScheduleTime = this.form.controls['ScheduleTime'].value;
        }
    }

    onSubmit(): void {
        debugger;
        if (this.demandModel.DemandId == 0) {
            UtilityService.setModelFromFormGroup<DemandModel>(this.demandModel, this.form, x => x.DemandId, x => x.DemandTypeId, x => x.Priority,
                x => x.DemandDesc, x => x.RequesterType, x => x.PDATicketNumber, x => x.TargetDepartmentId,
                x => x.ContactNumber, x => x.RequiredLocation, x => x.ScheduleTime, x => x.ContactNumber);
            this.demandModel.Caller.CallerName = this.form.controls["RequestedBy"].value;
            this.demandModel.Caller.ContactNumber = this.form.controls["ContactNumber"].value;
            this.demandModel.IncidentId = this.currentIncidentId;
            this.demandModel.RequesterDepartmentId = this.currentDepartmentId;
            if (this.demandTypes.find(x => x.DemandTypeId == this.demandModel.DemandTypeId).IsAutoApproved) {
                this.demandModel.IsApproved = true;
                this.demandModel.ApproverDepartmentId = null;
            }
            else {
                this.demandModel.IsApproved = false;
                this.demandModel.ApproverDepartmentId = this.demandTypes.find(x => x.DemandTypeId == this.demandModel.DemandTypeId).DepartmentId;
            }
            this.demandModel.DemandStatusDescription = 'New Request by ' + this.currentDepartmentName;
            this.demandModel.DemandCode = "DEM-" + UtilityService.UUID();
            if (this.demandModel.AffectedObjectId == 0) {
                delete this.demandModel.AffectedObjectId;
            }
            if (this.demandModel.AffectedPersonId == 0) {
                delete this.demandModel.AffectedPersonId;
            }


            this.demandModel.CommunicationLogs = this.SetCommunicationLog(this.demandModel);

            this.demandModel.DemandTrails = this.createDemandTrailModel(this.demandModel, this.demandModel, true);
            this.demandService.Create(this.demandModel)
                .subscribe((response: DemandModel) => {
                    this.toastrService.success('Demand successfully created.', 'Success', this.toastrConfig);
                    this.dataExchange.Publish("DemandAddedUpdated", response.DemandId);
                    this.initializeForm();
                    this.demandModel = new DemandModel();
                    this.showAdd = false;
                    this.buttonValue = "Create Demand";
                    this.childModal.hide();
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
            if (this.form.dirty) {
                this.formControlDirtyCheck();
                this.demandService.Update(this.demandModelEdit)
                    .subscribe((response: DemandModel) => {
                        this.toastrService.success('Demand successfully updated.', 'Success', this.toastrConfig);
                        this.dataExchange.Publish("DemandAddedUpdated",  this.demandModelEdit.DemandId);
                        let demandTrail = this.createDemandTrailModel(this.demandModel, this.demandModelEdit, false)[0];
                        demandTrail.DemandId = this.demandModel.DemandId;
                        this.demandTrailService.Create(demandTrail)
                            .subscribe((response: DemandTrailModel) => { },
                            (error: any) => {
                                console.log("Error in demandTrail");
                            });
                        if (this.caller.CallerId != 0) {
                            this.callerService.Update(this.caller)
                                .subscribe((response: CallerModel) => { },
                                (error: any) => {
                                    console.log("Error in demandTrail");
                                });
                        }
                        this.initializeForm();
                        this.demandModel = new DemandModel();
                        this.showAdd = false;
                        this.buttonValue = "Create Demand";
                        this.childModal.hide();
                    }, (error: any) => {
                        console.log("Error");
                    });
            }
        }
    };

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("OnDemandUpdate");
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    };
}