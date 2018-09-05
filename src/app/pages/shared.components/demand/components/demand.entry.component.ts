import {
    Component, ViewEncapsulation, Injector,
    OnInit, OnDestroy, ViewChild
} from '@angular/core';
import {
    FormGroup, FormControl, Validators
} from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs/Rx';
import { DemandService } from './demand.service';
import { DemandTrailService } from './demandtrail.service';
import { DemandModel } from './demand.model';
import { DemandTrailModel } from './demand.trail.model';
import { DemandTypeService, DemandTypeModel } from '../../../masterdata/demandtype';
import { DepartmentService, DepartmentModel } from '../../../masterdata/department';
import { PageService } from '../../../masterdata/page.functionality';
import {
    AffectedObjectsService, AffectedObjectsToView, AffectedPeopleService,
    AffectedPeopleToView, InvolvePartyModel, CommunicationLogModel
} from '../../../shared.components';
import { InvolvePartyService } from '../../involveparties';
import { CallerService, CallerModel } from '../../caller';
import {
    ResponseModel, DataExchangeService, FileUploadService,
    GlobalConstants, KeyValue, AutocompleteComponent,
    UtilityService, GlobalStateService, AuthModel, DateTimePickerOptions
} from '../../../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as moment from 'moment/moment';
import { DateTimePickerSelectEventArgs } from '../../../../shared/directives/datetimepicker';
import { FileStoreModel } from '../../../../shared/models/file.store.model';
import { FileStoreService } from '../../../../shared/services/common.service';

@Component({
    selector: 'demand-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/demand.entry.view.html'
})
export class DemandEntryComponent implements OnInit, OnDestroy {
    @ViewChild('childModal') public childModalEntry: ModalDirective;
    @ViewChild('inputFileDemand') inputFileDemand: any;

    public form: FormGroup;
    datepickerOption: DateTimePickerOptions = new DateTimePickerOptions();
    demandModel: DemandModel = new DemandModel();
    demandTypesAll: DemandTypeModel[];
    demandTypes: DemandTypeModel[];
    demandTypePreapproved: DemandTypeModel = new DemandTypeModel();
    date: Date = new Date();
    Action: string;
    priorities: any[] = GlobalConstants.Priority;
    requesterTypes: any[] = GlobalConstants.RequesterType;
    filtereddepartments: DepartmentModel[] = [];
    affectedPeople: AffectedPeopleToView[] = [];
    affectedObjects: AffectedObjectsToView[] = [];
    pdas: KeyValue[] = [];
    awbs: KeyValue[] = [];
    currentIncidentId: number;
    currentOrganizationId: number;
    currentDepartmentId: number;
    parentDeptId: number = null;
    currentDepartmentName: string = 'Command Centre';
    communicationLogs: CommunicationLogModel[];
    communicationLog: CommunicationLogModel;
    showAdd: boolean = true;
    demandTrail: DemandTrailModel;
    demandTrails: DemandTrailModel[];
    departments: DepartmentModel[];
    buttonValue: string = '';
    createdBy: number;
    demandModelEdit: DemandModel;
    credentialName: string;
    caller: CallerModel;
    credential: AuthModel;
    isReadonly: boolean = false;
    isEdit: boolean = false;
    protected _onRouteChange: Subscription;
    isArchive: boolean = false;
    resolutionTime: Date;
    submitted: boolean = false;
    filesToUpload: File[] = [];
    demandFilePath: string;
    demandFileName: string;
    public globalStateProxyOpen: GlobalStateService;
    public freshDemand: boolean = true;
    public isrejected: boolean = false;
    public isShowAddDemand: boolean = true;

    private ngUnsubscribe: Subject<any> = new Subject<any>();
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
        private demandTypeService: DemandTypeService, private injector: Injector,
        private departmentService: DepartmentService,
        private pageService: PageService,
        private demandTrailService: DemandTrailService,
        private callerService: CallerService,
        private involvedPartyService: InvolvePartyService,
        private affectedObjectsService: AffectedObjectsService,
        private affectedPeopleService: AffectedPeopleService,
        private globalState: GlobalStateService,
        private dataExchange: DataExchangeService<number>,
        private fileUploadService: FileUploadService,
        private toastrService: ToastrService,
        private fileStoreService: FileStoreService,
        private toastrConfig: ToastrConfig, private _router: Router) {
        this.showAdd = false;
        this.buttonValue = 'Create Demand';
        this.departments = [];
        this.globalStateProxyOpen = injector.get(GlobalStateService);
    }

    getDemandType(): void {
        this.demandTypeService.GetAll()
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<DemandTypeModel>) => {
                this.demandTypesAll = response.Records; //.filter((x) => x.DemandTypeId == 1)[0];
                this.demandTypes = response.Records.filter((x) => x.ActiveFlag === 'Active');
                this.demandModel.DemandTypeId = (this.demandModel.DemandTypeId === 0)
                    ? this.demandTypes[0].DemandTypeId
                    : this.demandModel.DemandTypeId;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    getFileDetails(e: any): void {
        this.filesToUpload = [];
        for (var i = 0; i < e.target.files.length; i++) {
            const extension = e.target.files[i].name.split('.').pop();
            if (extension !== 'exe' && extension !== 'dll')
                this.filesToUpload.push(e.target.files[i]);
            else {
                this.toastrService.error('Invalid File Format!', 'Error', this.toastrConfig);
                this.inputFileDemand.nativeElement.value = '';
            }
        }
    }

    getAllDepartments(): void {
        this.departmentService.GetAll()
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                this.departments = response.Records.filter(a => a.ActiveFlag == 'Active');
            }, (error: any) => {
                console.log('error:  ' + error);
            });
    }

    createDemandTrailModel(demand: DemandModel, demandForAnswer: DemandModel, flag): DemandTrailModel[] {
        const demandTrails: DemandTrailModel[] = [];
        const demandTrail: DemandTrailModel = new DemandTrailModel();
        let editedFields = '';
        let answer = '';
        let descchanged = '';

        demandTrail.Answers = '';
        demandTrail.IncidentId = demand.IncidentId;
        demandTrail.DemandTypeId = demand.DemandTypeId;
        demandTrail.DemandCode = demand.DemandCode;
        demandTrail.ScheduleTime = demand.ScheduleTime;
        demandTrail.ContactNumber = demand.ContactNumber;
        demandTrail.Priority = demand.Priority;
        demandTrail.RequiredLocation = demand.RequiredLocation;
        demandTrail.RequesterName = demand.RequestedBy;
        demandTrail.RequesterDepartmentName = this.departments
            .some((x) => x.DepartmentId === demand.RequesterDepartmentId) ?
            this.departments.find((x) => x.DepartmentId === demand.RequesterDepartmentId).DepartmentName : null;
        demandTrail.RequesterParentDepartmentName = this.departments
            .some((x) => x.DepartmentId === demand.RequesterParentDepartmentId) ?
            this.departments.find((x) => x.DepartmentId === demand.RequesterParentDepartmentId).DepartmentName : null;
        demandTrail.TargetDepartmentName = this.departments.find((x) => x.DepartmentId === demand.TargetDepartmentId).DepartmentName;
        demandTrail.ApproverDepartmentName = this.departments.some((x) => x.DepartmentId === demand.ApproverDepartmentId) ?
            this.departments.find((x) => x.DepartmentId === demand.ApproverDepartmentId).DepartmentName : null;
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
        demandTrail.ActiveFlag = 'Active';
        demandTrail.CreatedBy = demand.CreatedBy ? demand.CreatedBy : this.createdBy;
        demandTrail.CreatedOn = demand.CreatedOn ? demand.CreatedOn : new Date();

        const TargetDepartmentName = this.departments.some((x) => x.DepartmentId === demandForAnswer.TargetDepartmentId) ?
            this.departments.find((x) => x.DepartmentId === demandForAnswer.TargetDepartmentId).DepartmentName : undefined;
        const date = new Date();
        if (flag) {

            answer = `<p>${demand.DemandStatusDescription} <strong>Date :</strong>  ${moment(date).format('DD-MMM-YYYY HH:mm')} `;
        }
        else {
            answer = `<p>Demand Edited By ${demandTrail.RequesterName} ( ${demandTrail.RequesterDepartmentName} ) <strong>Date :</strong>  ${moment(date).format('DD-MMM-YYYY HH:mm')} `;
        }
        if (!flag && (demandForAnswer !== undefined)) {

            if (demandForAnswer.Priority) {
                editedFields = editedFields + `<strong>Priority</strong> : ${demandForAnswer.Priority} `;
            }
            if (demandForAnswer.DemandDesc) {
                editedFields = editedFields + `<strong>Description</strong> : ${demandForAnswer.DemandDesc} `;
            }
            if (demandForAnswer.RequesterType) {
                editedFields = editedFields + `<strong>Requester Type</strong> : ${demandForAnswer.RequesterType} `;
            }
            if (demandForAnswer.TargetDepartmentId) {
                editedFields = editedFields + `<strong>Target Department</strong> : ${TargetDepartmentName} `;
            }
            if (demandForAnswer.ContactNumber) {
                editedFields = editedFields + `<strong>Requester Contact Number</strong> : ${demandForAnswer.ContactNumber} `;
            }
            if (demandForAnswer.ScheduleTime) {
                const minutesInt = +demandForAnswer.ScheduleTime;
                const d = new Date(demand.CreatedOn);
                d.setMinutes(d.getMinutes() + minutesInt);
                const editedDate = moment(d).format('DD-MMM-YYYY HH:mm');
                editedFields = editedFields + `<strong>Expected Resolution Time</strong> : ${editedDate} `;
            }
            if (demandForAnswer.RequiredLocation) {
                editedFields = editedFields + `<strong>Required At Location</strong> : ${demandForAnswer.RequiredLocation} `;
            }

            if (demandForAnswer.DemandStatusDescription !== undefined && demandForAnswer.DemandStatusDescription.length > 0) {
                descchanged = `. ${demandForAnswer.DemandStatusDescription}.`;
            }
        }

        answer = answer + editedFields;
        if (descchanged.length > 0) {
            answer = answer + descchanged + '</p>';
        }
        else {
            answer = answer + '</p>';
        }

        demandTrail.Answers = answer;
        if ((!editedFields && flag) || (!flag && editedFields)) {
            demandTrails.push(demandTrail);
        }
        return demandTrails;
    }

    getPassengersCrews(currentIncident): void {
        this.involvedPartyService.GetFilterByIncidentId(currentIncident)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedPeople = this.affectedPeopleService.FlattenAffectedPeople(response.Records[0]);

                this.affectedPeople.forEach(x => {
                    if (x.PassengerName.trim() == "") {
                        x.PassCrewNm = x.CrewName;
                    }
                    else {
                        x.PassCrewNm = x.PassengerName;
                    }

                });

                this.affectedPeople = this.affectedPeople
                    .sort(function (a, b) { return (a.PassCrewNm.trim().toUpperCase() > b.PassCrewNm.trim().toUpperCase()) ? 1 : ((b.PassCrewNm.trim().toUpperCase() > a.PassCrewNm.trim().toUpperCase()) ? -1 : 0); });
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    getCargo(currentIncident): void {
        this.affectedObjectsService.GetFilterByIncidentId(currentIncident)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedObjects = this.affectedObjectsService.FlattenAffactedObjects(response.Records[0]);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    ChangeAffectedPeople(): void {
        this.demandModel.AffectedPersonId = this.form.controls['AffectedPersonId'].value;
        if (this.demandModel.AffectedPersonId != 0) {
            this.form.controls['AffectedObjectId'].reset({ value: '', disabled: true });
            this.demandModel.PDATicketNumber = this.affectedPeople
                .find((x) => x.AffectedPersonId == this.demandModel.AffectedPersonId).TicketNumber;
            this.form.controls['PDATicketNumber'].reset({ value: this.demandModel.PDATicketNumber, disabled: true });
        }
        else {
            this.form.controls['AffectedObjectId'].reset({ value: '', disabled: false });
            this.form.controls['PDATicketNumber'].reset({ value: '', disabled: true });
        }
    }

    ChangeAffectedObjects(): void {
        this.demandModel.AffectedObjectId = this.form.controls['AffectedObjectId'].value;
        if (this.demandModel.AffectedObjectId != 0) {
            this.form.controls['AffectedPersonId'].reset({ value: '', disabled: true });
            this.demandModel.PDATicketNumber = this.affectedObjects
                .find((x) => x.AffectedObjectId == this.demandModel.AffectedObjectId).TicketNumber;
            this.form.controls['PDATicketNumber'].reset({ value: this.demandModel.PDATicketNumber, disabled: true });
        }
        else {
            this.form.controls['AffectedPersonId'].reset({ value: '', disabled: false });
            this.form.controls['PDATicketNumber'].reset({ value: '', disabled: true });
        }
    }

    RemoveDemandTypeId(): void {
        let index: number = this.demandTypes.indexOf(this.demandTypePreapproved);
        if (index != -1) {
            this.demandTypes.splice(index, 1);
        }
    }

    AddDemandTypeId(): void {
        this.demandTypes.push(this.demandTypePreapproved);
    }

    showAddRegion(ShowAdd: boolean): void {
        this.showAdd = true;
        this.buttonValue = 'Create Demand';
        this.resetForm();
        this.RemoveDemandTypeId();
        this.demandModel.DemandId = 0;
        this.demandModel.RequesterDepartmentId = this.currentDepartmentId;
        this.demandModel.AffectedObjectId = 0;
        this.demandModel.AffectedPersonId = 0;
        this.demandModel.DemandTypeId = 0;
        this.demandModel.Priority = '0';
        this.demandModel.RequesterType = '';
        this.demandModel.TargetDepartmentId = 0;
        this.demandModel.Caller = new CallerModel();
        this.demandModel.RequestedBy = this.credentialName;
        this.demandModel.Caller.FirstName = this.credentialName;
        this.demandModel.Caller.LastName = '';
        this.Action = 'Submit';
        this.freshDemand = true;
        this.isReadonly = false;
        this.isEdit = false;
        this.childModalEntry.show();
    }

    setModelFormGroup(model: DemandModel, isDisable: boolean, ...params: Array<(entity: DemandModel) => any>): void {
        const paramNames: string[] = [];
        if (params.length > 0) {
            params.forEach((x: Function) => {
                paramNames.push(UtilityService.getReturnType(x)[0]);
            });

            if (paramNames.length > 0) {
                paramNames.forEach((x: string) => {
                    this.form.controls[x].reset({ value: model[x].toString(), disabled: isDisable });
                });
            }
        }
    }

    setModelForUpdate(id: string) {

        this.childModalEntry.hide();
        const idNum: number = +(id.split('!')[0]);

        this.demandService.GetByDemandId(idNum)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<DemandModel>) => {
                this.freshDemand = false;
                this.demandModel = response.Records[0];
                this.isrejected = this.demandModel.IsRejected;
                // if (this.demandModel.DemandStatusDescription.indexOf('New Request by') > -1) {
                if ((this.demandModel.ApprovedBy == null && this.demandModel.IsCompleted === false) || this.demandModel.IsRejected === true) {
                    this.freshDemand = true;
                }
                this.setModelFormGroup(response.Records[0], false, (x) => x.DemandId, (x) => x.DemandTypeId,
                    (x) => x.Priority, (x) => x.DemandDesc, (x) => x.RequesterType,
                    (x) => x.PDATicketNumber, (x) => x.TargetDepartmentId, (x) => x.ContactNumber, (x) => x.RequiredLocation);

                const scheduleTime = response.Records[0].ScheduleTime;
                const createdOn = new Date(response.Records[0].CreatedOn);
                const timediff = createdOn.getTime() + (+scheduleTime) * 60000;

                const resolutiontime = new Date(timediff);
                this.form.controls['ScheduleTime'].reset({ value: moment(resolutiontime).format('DD-MMM-YYYY HH:mm'), disabled: false });
                this.caller = this.demandModel.Caller || new CallerModel();
                this.showAdd = true;
                this.buttonValue = 'Create Demand';
                this.RemoveDemandTypeId();
                this.demandTypePreapproved = this.demandTypesAll.filter((x) => x.DemandTypeId == this.demandModel.DemandTypeId)[0];
                this.AddDemandTypeId();
                this.isReadonly = false;
                this.isEdit = true;
                this.childModalEntry.show();

                this.form.controls['PDATicketNumber'].reset({ value: this.demandModel.PDATicketNumber, disabled: true });
                this.form.controls['AffectedPersonId'].reset({ value: this.demandModel.AffectedPersonId, disabled: true });
                this.form.controls['AffectedObjectId'].reset({ value: this.demandModel.AffectedObjectId, disabled: true });
                this.form.controls['DemandTypeId'].reset({ value: +this.demandModel.DemandTypeId, disabled: true });
                this.form.controls['RequestedBy'].reset({ value: this.demandModel.RequestedBy, disabled: false });  // this.caller.FirstName
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }


    showDemandDetails(id: string) {
        const idNum: number = +(id.split('!')[0]);
        this.demandService.GetByDemandId(idNum)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<DemandModel>) => {
                this.demandModel = response.Records[0];

                this.RemoveDemandTypeId();
                this.demandTypePreapproved = this.demandTypesAll.filter((x) => x.DemandTypeId == this.demandModel.DemandTypeId)[0];
                this.AddDemandTypeId();

                this.setModelFormGroup(response.Records[0], true, (x) => x.DemandId, (x) => x.DemandTypeId,
                    (x) => x.Priority, (x) => x.DemandDesc, (x) => x.RequestedBy, (x) => x.RequesterType,
                    (x) => x.PDATicketNumber, (x) => x.TargetDepartmentId, (x) => x.ContactNumber, (x) => x.RequiredLocation);

                const scheduleTime = response.Records[0].ScheduleTime;
                const createdOn = new Date(response.Records[0].CreatedOn);
                const timediff = createdOn.getTime() + (+scheduleTime) * 60000;
                const resolutiontime = new Date(timediff);
                this.form.controls['ScheduleTime'].reset({ value: moment(resolutiontime).format('DD-MMM-YYYY HH:mm'), disabled: true });
                this.caller = this.demandModel.Caller || new CallerModel();
                this.showAdd = true;
                this.isReadonly = true;
                this.childModalEntry.show();
                this.submitted = false;
                this.form.controls['PDATicketNumber'].reset({ value: this.demandModel.PDATicketNumber, disabled: true });
                this.form.controls['AffectedPersonId'].reset({ value: this.demandModel.AffectedPersonId, disabled: true });
                this.form.controls['AffectedObjectId'].reset({ value: this.demandModel.AffectedObjectId, disabled: true });
                this.form.controls['DemandTypeId'].reset({ value: this.demandModel.DemandTypeId, disabled: true });
                this.form.controls['RequestedBy'].reset({ value: this.demandModel.RequestedBy, disabled: true });
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    cancelModal(): void {
        this.childModalEntry.hide();
        this.resetForm();
    }

    ngOnInit(): any {
        this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.currentOrganizationId = +UtilityService.GetFromSession('CurrentOrganizationId');
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');

        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.isArchive = true;
            this.currentIncidentId = +UtilityService.GetFromSession('ArchieveIncidentId');
            this.demandModel.IncidentId = this.currentIncidentId;
        }
        else {
            this.isArchive = false;
            this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
            this.demandModel.IncidentId = this.currentIncidentId;
            this.getPassengersCrews(this.currentIncidentId);
            this.getCargo(this.currentIncidentId);
        }

        this.credential = UtilityService.getCredentialDetails();
        this.createdBy = +this.credential.UserId;
        this.credentialName = this.credential.UserName;
        this.datepickerOption.position = 'top left';
        this.datepickerOption.minDate = new Date();

        this.getDemandType();
        this.getAllDepartments();

        this.initializeForm();
        this.getDepartmentNameAndParentDepartment(this.currentDepartmentId);
        this.demandModel.DemandId = 0;

        this.demandModel.RequesterDepartmentId = this.currentDepartmentId;
        this.demandModel.AffectedObjectId = 0;
        this.demandModel.AffectedPersonId = 0;
        this.demandModel.DemandTypeId = 0;
        this.demandModel.Priority = '0';
        this.demandModel.RequesterType = '0';
        this.demandModel.TargetDepartmentId = 0;
        this.demandModel.Caller = new CallerModel();
        this.demandModel.RequestedBy = this.credentialName;
        this.demandModel.Caller.FirstName = this.credentialName;
        this.demandModel.Caller.LastName = '';
        this.Action = 'Submit';
        this.isReadonly = false;


        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.OnDemandUpdate,
            (model) => this.setModelForUpdate(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.OnDemandDetailClick,
            (model) => this.showDemandDetails(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard,
            (model: KeyValue) => this.departmentChangeHandler(model));
    }

    getDepartmentNameAndParentDepartment(departmentId): void {
        this.departmentService.Get(departmentId)
            .takeUntil(this.ngUnsubscribe)
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
        this.communicationLog.Answers = demand.DemandStatusDescription + ', '
            + this.demandTypes.find((x) => x.DemandTypeId === demand.DemandTypeId).DemandTypeName + ' demand for ' +
            this.departments.find((x) => x.DepartmentId === demand.TargetDepartmentId).DepartmentName
            + '. Demand Details : ' + demand.DemandDesc + '. ';

        this.communicationLog.RequesterName = demand.RequestedBy;
        this.communicationLog.RequesterDepartment = this.currentDepartmentName;
        this.communicationLog.RequesterType = 'Demand';
        this.communicationLog.DemandId = demand.DemandId;
        this.communicationLog.InteractionDetailsType = GlobalConstants.InteractionDetailsTypeDemand;

        if (demand.AffectedPersonId != null)
            this.communicationLog.AffectedPersonId = demand.AffectedPersonId;
        else
            delete this.communicationLog.AffectedPersonId;

        if (demand.AffectedObjectId != null)
            this.communicationLog.AffectedObjectId = demand.AffectedObjectId;
        else
            delete this.communicationLog.AffectedObjectId;

        this.communicationLogs.push(this.communicationLog);
        return this.communicationLogs;
    }

    initializeForm(): void {
        this.form = new FormGroup({
            DemandId: new FormControl({ value: 0, disabled: false }),
            DemandTypeId: new FormControl({ value: '', disabled: false }, [Validators.required]),
            Priority: new FormControl({ value: '', disabled: false }, [Validators.required]),
            DemandDesc: new FormControl({ value: '', disabled: false }, [Validators.required]),
            RequestedBy: new FormControl({ value: this.credentialName, disabled: false }, [Validators.required]),
            RequesterType: new FormControl({ value: '', disabled: false }, [Validators.required]),
            PDATicketNumber: new FormControl({ value: '', disabled: true }),
            TargetDepartmentId: new FormControl({ value: '', disabled: false }, [Validators.required]),
            ContactNumber: new FormControl({ value: '', disabled: false }, [Validators.required]),
            ScheduleTime: new FormControl({ value: '', disabled: false }, [Validators.required]),
            RequiredLocation: new FormControl({ value: '', disabled: false }, [Validators.required]),
            AffectedPersonId: new FormControl({ value: '', disabled: false }),
            AffectedObjectId: new FormControl({ value: '', disabled: false }),
            FileInputDemand: new FormControl()
        });
    }

    resetForm(): void {
        this.form.controls['DemandId'].reset({ value: 0, disabled: false });
        this.form.controls['DemandTypeId'].reset({ value: '', disabled: false });
        this.form.controls['Priority'].reset({ value: '', disabled: false });
        this.form.controls['DemandDesc'].reset({ value: '', disabled: false });
        this.form.controls['RequestedBy'].reset({ value: this.credentialName, disabled: false });
        this.form.controls['RequesterType'].reset({ value: '', disabled: false });
        this.form.controls['PDATicketNumber'].reset({ value: '', disabled: true });
        this.form.controls['TargetDepartmentId'].reset({ value: '', disabled: false });
        this.form.controls['ContactNumber'].reset({ value: '', disabled: false });
        this.form.controls['ScheduleTime'].reset({ value: '', disabled: false });
        this.form.controls['RequiredLocation'].reset({ value: '', disabled: false });
        this.form.controls['AffectedPersonId'].reset({ value: '', disabled: false });
        this.form.controls['AffectedObjectId'].reset({ value: '', disabled: false });
    }

    formControlDirtyCheck(): void {
        this.demandModelEdit = new DemandModel();
        delete this.demandModelEdit.ActiveFlag;
        delete this.demandModelEdit.CreatedBy;
        delete this.demandModelEdit.CreatedOn;
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
            this.caller.FirstName = this.form.controls['RequestedBy'].value;
            this.demandModelEdit.RequestedBy = this.form.controls['RequestedBy'].value;
        }
        if (this.form.controls['RequesterType'].touched) {
            this.demandModelEdit.RequesterType = this.form.controls['RequesterType'].value;
        }
        if (this.form.controls['TargetDepartmentId'].touched) {
            this.demandModelEdit.TargetDepartmentId = +this.form.controls['TargetDepartmentId'].value;
        }
        if (this.form.controls['ContactNumber'].touched) {
            this.demandModelEdit.ContactNumber = this.form.controls['ContactNumber'].value;
            this.caller.ContactNumber = this.form.controls['ContactNumber'].value;
        }
        if (this.form.controls['RequiredLocation'].touched) {
            this.demandModelEdit.RequiredLocation = this.form.controls['RequiredLocation'].value;
        }
        if (this.form.controls['FileInputDemand'].touched) {
            this.demandFileName = this.inputFileDemand.nativeElement.value;
        }
    }

    uploadFile(resolutionTimeChanged: boolean): void {
        if (this.filesToUpload.length > 0) {
            const baseUrl = GlobalConstants.EXTERNAL_URL;
            const organizationId = +UtilityService.GetFromSession('CurrentOrganizationId'); // To be changed by Dropdown when Demand table will change
            const moduleName = 'Demand';
            const param = `${this.currentIncidentId}/${organizationId}/${this.currentDepartmentId}/${moduleName}`;
            this.date = new Date();

            this.fileUploadService.uploadFiles<string>(baseUrl + './api/fileUpload/UploadFilesModuleWise/' + param,
                this.filesToUpload, this.date.toString())
                .takeUntil(this.ngUnsubscribe)
                .subscribe((result: string) => {
                    const fileStore: FileStoreModel = new FileStoreModel();
                    if (this.demandModel.FileStores != null) {
                        fileStore.FileStoreID = this.demandModel.FileStores[0].FileStoreID;
                    }
                    else {
                        fileStore.FileStoreID = 0;
                    }
                    fileStore.IncidentId = this.currentIncidentId;
                    fileStore.DepartmentId = this.currentDepartmentId;
                    fileStore.OrganizationId = organizationId;
                    fileStore.FilePath = result;
                    fileStore.UploadedFileName = this.filesToUpload[0].name;

                    if (this.demandModel.DemandId === 0) {
                        fileStore.DemandId = this.demandModel.DemandId;
                    }
                    else {
                        // fileStore.DemandId = this.demandModelEdit.DemandId;
                        fileStore.DemandId = this.demandModel.DemandId;
                    }
                    fileStore.ModuleName = moduleName;
                    fileStore.CreatedBy = +this.credential.UserId;
                    fileStore.CreatedOn = new Date();
                    fileStore.ActiveFlag = 'Active';

                    if (this.demandModel.DemandId === 0) {
                        this.demandModel.FileStores = [];
                        this.demandModel.FileStores.push(fileStore);
                        this.demandCreate();
                    }
                    else {
                        this.fileStoreService.Create(fileStore)
                            .takeUntil(this.ngUnsubscribe)
                            .subscribe((response: FileStoreModel) => {
                                if (this.form.dirty) {
                                    this.demandUpdate(resolutionTimeChanged);
                                }
                                else {
                                    this.toastrService.success('Demand successfully updated.', 'Success', this.toastrConfig);
                                    const num = UtilityService.UUID();
                                    this.globalStateProxyOpen.NotifyDataChanged(GlobalConstants.DataExchangeConstant.DemandAddedUpdated, num);
                                    this.initializeForm();
                                    this.demandModel = new DemandModel();
                                    this.showAdd = false;
                                    this.buttonValue = 'Create Demand';
                                    this.childModalEntry.hide();
                                    this.filesToUpload = [];
                                }
                            }, (error: any) => {
                                console.log(`Error: ${error}`);
                            });
                    }

                    this.filesToUpload.length = null;
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
        }
    }

    addzero(num: number): string {
        let str: string = num.toString();
        if (num < 10) {
            str = '0' + str;
        }
        return str;
    }

    onSubmit(): void {
        this.submitted = true;
        if (this.form.valid) {
            if (this.demandModel.DemandId === 0) {
                UtilityService.setModelFromFormGroup<DemandModel>(this.demandModel, this.form, (x) => x.DemandId,
                    (x) => x.DemandTypeId, (x) => x.Priority, (x) => x.DemandDesc, (x) => x.RequesterType,
                    (x) => x.PDATicketNumber, (x) => x.TargetDepartmentId, (x) => x.ContactNumber,
                    (x) => x.RequiredLocation, (x) => x.ContactNumber);

                const now = new Date();
                const currentDate = now.getTime();
                const timeDiffSec = this.resolutionTime.getTime() - currentDate;
                const timediffMin = Math.floor(timeDiffSec / 60000);
                this.demandModel.ScheduleTime = timediffMin.toString();
                this.demandModel.DemandTypeId = +this.demandModel.DemandTypeId;
                this.demandModel.TargetDepartmentId = +this.demandModel.TargetDepartmentId;
                this.demandModel.RequestedBy = this.form.controls['RequestedBy'].value;
                this.demandModel.Caller.FirstName = this.form.controls['RequestedBy'].value;
                this.demandModel.Caller.LastName = '';
                this.demandModel.Caller.ContactNumber = this.form.controls['ContactNumber'].value;
                this.demandModel.IncidentId = this.currentIncidentId;
                this.demandModel.RequesterDepartmentId = this.currentDepartmentId;
                this.demandModel.DemandCode = 'DEMR-' + this.addzero(now.getSeconds()) + this.addzero(now.getMinutes()) + this.addzero(now.getHours()) +
                    this.addzero(now.getDate()) + this.addzero(now.getMonth() + 1) + now.getFullYear().toString();

                if (this.demandTypes.find((x) => x.DemandTypeId === this.demandModel.DemandTypeId).IsAutoApproved) {
                    this.demandModel.IsApproved = true;
                    this.demandModel.ApproverDepartmentId = null;
                    this.demandModel.DemandStatusDescription = `New Demand (${this.demandModel.DemandCode}) created by ` +
                        this.demandModel.RequestedBy + ' (' + this.currentDepartmentName + ')';
                }
                else {
                    this.demandModel.IsApproved = false;
                    const demandtypeitem: DemandTypeModel = this.demandTypes.find((x) => x.DemandTypeId === this.demandModel.DemandTypeId);
                    this.demandModel.DemandStatusDescription = `New Demand (${this.demandModel.DemandCode}) created by ` +
                        this.demandModel.RequestedBy + ' (' + this.currentDepartmentName + '). ' + 'Pending approval from ' + demandtypeitem.ApproverDepartment.DepartmentName;
                    this.demandModel.ApproverDepartmentId = demandtypeitem.DepartmentId;
                }

                if (this.demandModel.AffectedObjectId === 0) {
                    delete this.demandModel.AffectedObjectId;
                }
                if (this.demandModel.AffectedPersonId === 0) {
                    delete this.demandModel.AffectedPersonId;
                }
                this.demandModel.CommunicationLogs = this.SetCommunicationLog(this.demandModel);
                this.demandModel.DemandTrails = this.createDemandTrailModel(this.demandModel, this.demandModel, true);
                const resolutionTimeChanged = false;
                if (this.filesToUpload.length) {
                    this.uploadFile(resolutionTimeChanged);
                }
                else {
                    this.demandModel.FileStores = [];
                    this.demandCreate();
                }
            }
            else {
                this.formControlDirtyCheck();
                let resolutionTimeChanged = false;
                this.resolutionTime = new Date(this.form.controls['ScheduleTime'].value);

                if (this.resolutionTime) {
                    this.demandService.GetByDemandId(this.demandModelEdit.DemandId)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe((response: ResponseModel<DemandModel>) => {
                            const createdOnDate = new Date(response.Records[0].CreatedOn);
                            const time = createdOnDate.getTime();
                            const timeDiffSec = this.resolutionTime.getTime() - time;
                            const timediffMin = Math.floor(timeDiffSec / 60000);
                            const scheduletime = timediffMin.toString();
                            this.demandModelEdit.ScheduleTime = scheduletime;
                            resolutionTimeChanged = true;
                            if (this.filesToUpload.length) {
                                this.uploadFile(resolutionTimeChanged);
                            }
                            else {
                                this.demandUpdate(resolutionTimeChanged);
                            }
                        }, (error: any) => {
                            console.log(`Error: ${error}`);
                        });
                }
                else {
                    if (this.filesToUpload.length) {
                        this.uploadFile(resolutionTimeChanged);
                    }
                    else {
                        this.demandUpdate(resolutionTimeChanged);
                    }
                }
            }
        }
    }

    demandCreate(): void {
        this.demandService.Create(this.demandModel)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: DemandModel) => {
                this.toastrService.success('Demand successfully created.', 'Success', this.toastrConfig);
                const num = UtilityService.UUID();
                this.globalStateProxyOpen.NotifyDataChanged(GlobalConstants.DataExchangeConstant.DemandAddedUpdated, num);
                this.initializeForm();
                this.demandModel = new DemandModel();
                this.showAdd = false;
                this.buttonValue = 'Create Demand';
                this.submitted = false;
                this.childModalEntry.hide();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    demandUpdate(resolutionTimeChanged): void {
        if (this.form.dirty || resolutionTimeChanged) {
            if (this.demandModel.IsRejected === true && !this.demandTypes.find((x) => x.DemandTypeId === this.demandModel.DemandTypeId).IsAutoApproved) {
                const demandtypeitem: DemandTypeModel = this.demandTypes.find((x) => x.DemandTypeId === this.demandModel.DemandTypeId);
                this.demandModelEdit.IsRejected = false;
                this.demandModelEdit.RejectedBy = null;
                this.demandModelEdit.RejectedDate = null;
                this.demandModelEdit.DemandStatusDescription = 'Updated and Pending approval from ' + demandtypeitem.ApproverDepartment.DepartmentName;
            }

            this.demandService.Update(this.demandModelEdit)
                .takeUntil(this.ngUnsubscribe)
                .subscribe((response: DemandModel) => {
                    this.toastrService.success('Demand successfully updated.', 'Success', this.toastrConfig);
                    const num = UtilityService.UUID();
                    this.globalStateProxyOpen.NotifyDataChanged(GlobalConstants.DataExchangeConstant.DemandAddedUpdated, num);
                    this.demandModel.DemandStatusDescription = this.demandModelEdit.DemandStatusDescription;
                    const demandTrail = this.createDemandTrailModel(this.demandModel, this.demandModelEdit, false)[0];
                    demandTrail.DemandId = this.demandModel.DemandId;
                    this.freshDemand = false;

                    this.demandTrailService.Create(demandTrail)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe((resp: DemandTrailModel) => { },
                            (error: any) => {
                                console.log('Error in demandTrail');
                            });

                    if (this.caller.CallerId !== 0) {
                        this.callerService.Update(this.caller)
                            .takeUntil(this.ngUnsubscribe)
                            .subscribe((resp: CallerModel) => { },
                                (error: any) => {
                                    console.log('Error in demandTrail');
                                });
                    }

                    this.initializeForm();
                    this.demandModel = new DemandModel();
                    this.showAdd = false;
                    this.buttonValue = 'Create Demand';
                    this.submitted = false;
                    this.childModalEntry.hide();
                    
                }, (error: any) => {
                    console.log('Error');
                });
        }
        else {
            this.submitted = false;
            this.childModalEntry.hide();
        }
    }

    public dateTimeSet(date: DateTimePickerSelectEventArgs, controlName: string): void {
        this.resolutionTime = new Date(date.SelectedDate.toString());
        this.form.get('ScheduleTime')
            .setValue(moment(this.resolutionTime).format('DD-MMM-YYYY HH:mm'));
    }

    ngOnDestroy(): void {
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.OnDemandUpdate);
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.OnDemandDetailClick);
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard);
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getPassengersCrews(this.currentIncidentId);
        this.getCargo(this.currentIncidentId);
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getDepartmentNameAndParentDepartment(this.currentDepartmentId);
    }
}
