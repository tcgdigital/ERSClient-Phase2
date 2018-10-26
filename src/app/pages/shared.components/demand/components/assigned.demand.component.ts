import {
    Component, ViewEncapsulation, OnDestroy, Injector,
    OnInit, AfterContentInit, ViewChild
} from '@angular/core';
import { Observable, Subscription, Subject } from 'rxjs/Rx';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';
import { InvolvePartyModel } from '../../involveparties';
import { DemandModel, DemandModelToView, DemandRemarkLogModel } from './demand.model';
import { DemandService } from './demand.service';
import { DemandTrailService } from './demandtrail.service';
import { DemandTrailModel } from './demand.trail.model';
import { DemandRemarkLogService } from './demand.remarklogs.service';
import { DepartmentService, DepartmentModel } from '../../../masterdata/department';
import * as moment from 'moment/moment';
import {
    ResponseModel, DataExchangeService, KeyValue,
    GlobalConstants, GlobalStateService, UtilityService,
    AuthModel
} from '../../../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'assigned-demand',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/assigned.demand.view.html'
})
export class AssignedDemandComponent implements OnInit, AfterContentInit, OnDestroy {
    @ViewChild('childModalRemarks') public childModalRemarks: ModalDirective;
    @ViewChild('childModal') public childModal: ModalDirective;
    @ViewChild('childModalTrail') public childModalTrail: ModalDirective;

    demands: DemandModelToView[] = [];
    demand: DemandModelToView = new DemandModelToView();
    currentDepartmentId: number;
    currentDepartmentName: string;
    currentIncidentId: number;
    Remarks: string;
    demandRemarks: DemandRemarkLogModel[];
    RemarkToCreate: DemandRemarkLogModel;
    createdByName: string;
    demandTrail: DemandTrailModel;
    demandTrails: DemandTrailModel[];
    departments: DepartmentModel[];
    demandForRemarks: DemandModelToView;
    credential: AuthModel;
    protected _onRouteChange: Subscription;
    isArchive: boolean = false;
    demandFilePath: string;
    public demandTypeName: string = '';
    public requesterDepartmentName: string = '';
    public globalStateProxyOpen: GlobalStateService;
    public isShowAssignToMeDemand: boolean = true;
    public isInvalidRemarks: boolean = false;
    private ngUnsubscribe: Subject<any> = new Subject<any>();
    public isDashboradDemandAssignedDownloadLink: boolean = true;
    /**
     * Creates an instance of AssignedDemandComponent.
     * @param {DemandService} demandService
     * @param {DepartmentService} departmentService
     * @param {DemandRemarkLogService} demandRemarkLogsService
     * @param {GlobalStateService} globalState
     *
     * @memberOf AssignedDemandComponent
     */
    constructor(private demandService: DemandService, private injector: Injector,
        private departmentService: DepartmentService,
        private demandRemarkLogsService: DemandRemarkLogService,
        private demandTrailService: DemandTrailService,
        private globalState: GlobalStateService,
        private dataExchange: DataExchangeService<number>,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig, private _router: Router) {
        this.demandRemarks = [];
        this.demandForRemarks = new DemandModelToView();
        this.demandFilePath = GlobalConstants.EXTERNAL_URL + 'api/FileDownload/GetFile/Demand/';
        this.globalStateProxyOpen = injector.get(GlobalStateService);
    }

    public ngOnInit(): void {
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');

        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.isArchive = true;
            this.currentIncidentId = +UtilityService.GetFromSession('ArchieveIncidentId');
        }
        else {
            this.isArchive = false;
            this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        }
        this.getAssignedDemands(this.currentDepartmentId, this.currentIncidentId);
        this.credential = UtilityService.getCredentialDetails();
        this.createdByName = this.credential.UserName;
        this.getAllDepartments();

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard,
            (model: KeyValue) => this.departmentChangeHandler(model));

        // SignalR Notification
        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveDemandAssignedResponse.Key, (model: DemandModel) => {
                // this.getAssignedDemands(model.TargetDepartmentId, model.IncidentId);
                this.getAssignedDemands(this.currentDepartmentId, this.currentIncidentId);
            });

        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveCompletedDemandAssignedResponse.Key, (model: DemandModel) => {
                // this.getAssignedDemands(model.TargetDepartmentId, model.IncidentId);
                this.getAssignedDemands(this.currentDepartmentId, this.currentIncidentId);
            });
    }

    public openDemandDetails(demandId: number): void {
        this.demand = this.demands.find((x) => x.DemandId === demandId);
        this.childModal.show();
    }

    public getAssignedDemands(deptId: number, incidentId: number): void {
        this.demandService.GetForAssignedDept(deptId, incidentId)
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<DemandModel>) => {
                this.demands = this.demandService.DemandMapper(response.Records);
                UtilityService.SetRAGStatus(this.demands, 'Demand');
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    public cancelModal(): any {
        this.demand = new DemandModelToView();
        this.childModal.hide();
    }

    public getDemandRemarks(demandId): void {
        this.demandRemarkLogsService.GetDemandRemarksByDemandId(demandId)
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<DemandRemarkLogModel>) => {
                this.demandRemarks = response.Records;
                this.childModalRemarks.show();
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    public getCurrentDepartmentName(departmentId): string {
        return this.departments.find((x) => x.DepartmentId === departmentId).DepartmentName;
    }

    public getAllDepartments() {
        this.departmentService.GetAll()
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                this.departments = response.Records;
                this.currentDepartmentName = this.getCurrentDepartmentName(this.currentDepartmentId);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    public createDemandTrailModel(demand: DemandModelToView, flag, OriginalDemand?: DemandModel): DemandTrailModel[] {
        this.demandTrails = [];
        this.demandTrail = new DemandTrailModel();
        const description = flag ? `Completed by ${this.createdByName}( ${this.currentDepartmentName})` : demand.DemandStatusDescription;
        this.demandTrail.Answers = '';
        this.demandTrail.DemandId = demand.DemandId;
        this.demandTrail.ScheduleTime = demand.ScheduleTime;
        this.demandTrail.ContactNumber = demand.ContactNumber;
        this.demandTrail.Priority = demand.Priority;
        this.demandTrail.RequiredLocation = demand.RequiredLocation;
        this.demandTrail.RequesterDepartmentName = demand.RequesterDepartmentName;
        this.demandTrail.TargetDepartmentName = this.currentDepartmentName;
        this.demandTrail.ApproverDepartmentName = this.departments
            .some((x: DepartmentModel) => x.DepartmentId === demand.ApproverDeptId) ?
            this.departments.find((x: DepartmentModel) => x.DepartmentId === demand.ApproverDeptId).DepartmentName : null;
        this.demandTrail.DemandDesc = demand.DemandDesc;
        this.demandTrail.IsCompleted = true;
        this.demandTrail.ScheduledClose = new Date();
        this.demandTrail.IsClosed = false;
        this.demandTrail.ClosedOn = null;
        this.demandTrail.DemandStatusDescription = description;
        this.demandTrail.Remarks = demand.Remarks;
        this.demandTrail.ActiveFlag = 'Active';
        this.demandTrail.CreatedOn = demand.CreatedOn;

        const date = new Date();
        let answer = `<div><p>Demand ${this.demandTrail.DemandStatusDescription} <strong>Date :</strong>  ${moment(date).format('DD-MMM-YYYY HH:mm')} </p><div>`;
        if (!flag && (OriginalDemand != null)) {
            this.demandTrail.IncidentId = OriginalDemand.IncidentId;
            this.demandTrail.DemandTypeId = OriginalDemand.DemandTypeId;
            this.demandTrail.DemandCode = OriginalDemand.DemandCode;
            this.demandTrail.RequesterName = OriginalDemand.RequestedBy;
            this.demandTrail.RequesterType = OriginalDemand.RequesterType;
            this.demandTrail.IsApproved = OriginalDemand.IsApproved;
            this.demandTrail.ApprovedDt = OriginalDemand.ApprovedDt;
            this.demandTrail.IsCompleted = false;
            this.demandTrail.ScheduledClose = null;
            this.demandTrail.IsRejected = false;
            this.demandTrail.RejectedDate = null;
            answer = `<div><p> Demand Edited By ${this.currentDepartmentName}  <strong>Date :</strong> ${moment(date).format('DD-MMM-YYYY HH:mm')}  </p><div>`;

            if (OriginalDemand.ScheduleTime) {
                const minutesInt = parseInt(OriginalDemand.ScheduleTime);
                const d = new Date(OriginalDemand.CreatedOn);
                d.setMinutes(d.getMinutes() + minutesInt);
                const editedDate = moment(d).format('DD-MMM-YYYY HH:mm');
                answer = answer + '<strong>Expected Resolution Time</strong> : ' + editedDate + '  ';
            }
        }

        this.demandTrail.Answers = answer;
        this.demandTrails.push(this.demandTrail);
        return this.demandTrails;
    }

    public openDemandRemarks(demand) {
        this.demandForRemarks = demand;
        this.getDemandRemarks(demand.DemandId);
    }

    public cancelRemarkUpdate(): void {
        this.isInvalidRemarks = false;
        this.childModalRemarks.hide();
    }

    public saveRemark(remarks): void {
        if (remarks == '' || remarks == undefined) {
            this.isInvalidRemarks = true;
            return;
        }
        const demand: DemandModelToView = this.demandForRemarks;
        this.RemarkToCreate = new DemandRemarkLogModel();
        this.RemarkToCreate.Remark = remarks;
        this.RemarkToCreate.DemandId = demand.DemandId;
        this.RemarkToCreate.RequesterDepartmentName = this.currentDepartmentName;
        this.RemarkToCreate.TargetDepartmentName = demand.TargetDepartmentName;
        this.RemarkToCreate.CreatedByName = this.createdByName;

        this.demandRemarkLogsService.Create(this.RemarkToCreate)
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: DemandRemarkLogModel) => {
                this.toastrService.success('Remark saved successfully.', 'Success', this.toastrConfig);
                this.getDemandRemarks(demand.DemandId);
                this.Remarks = '';
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
                alert('Error occured during saving the remark');
            });
    }

    public isCompleted(item: DemandModelToView): any {
        return item.IsCompleted === true;
    }

    public submit(): void {
        if (this.demands.length > 0) {
            debugger;
            const demandCompletion: DemandModel[] = this.demands
                .filter(this.isCompleted).map((x) => {
                    debugger;
                    const item: DemandModel = new DemandModel();
                    item.DemandId = x.DemandId;
                    debugger;
                    item.ScheduledClose = new Date(),
                        item.ClosedByDepartmentId = this.currentDepartmentId;
                    item.DemandStatusDescription = `Completed by ${this.currentDepartmentName}`,
                        item.IsCompleted = x.IsCompleted,
                        item.IsRejected = false;
                    item.RejectedDate = null;
                    item.RejectedBy = null;
                    item.Remarks = x.Remarks;
                    item.DemandTrails = this.createDemandTrailModel(x, true);
                    return item;
                });

            if (demandCompletion.length === 0) {
                this.toastrService.error('Please select at least one request');
            }
            else {
                debugger;
                this.demandService.UpdateBulkForCompletion(demandCompletion)
                    // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe((response: DemandModel[]) => {
                        this.toastrService.success('Demand status updated successfully.', 'Success', this.toastrConfig);
                        this.getAssignedDemands(this.currentDepartmentId, this.currentIncidentId);
                        this.globalStateProxyOpen.NotifyDataChanged(GlobalConstants.DataExchangeConstant.DemandAssigned, null);
                    }, (error: any) => {
                        console.log(`Error: ${error.message}`);
                    });
            }
        }
        else {
            this.toastrService.error('There is no request assigned.');
        }
    }

    public cancelTrail(): void {
        this.childModalTrail.hide();
    }

    public getDemandTrails(demandId): void {
        this.demandTrailService.getDemandTrailByDemandId(demandId)
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<DemandTrailModel>) => {
                this.demandTrails = response.Records;
                this.childModalTrail.show();
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    public openTrail(demand: DemandModelToView): void {
        this.demandTypeName = demand.DemandTypeName;
        this.requesterDepartmentName = demand.RequesterDepartmentName;
        this.getDemandTrails(demand.DemandId);
    }

    public ngOnDestroy(): void {
        //this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard);
        //this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public ngAfterContentInit(): any {
        // this.setRagStatus();
        //UtilityService.SetRAGStatus(this.demands, 'Demand');
    }
    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getAssignedDemands(this.currentDepartmentId, this.currentIncidentId);
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getAssignedDemands(this.currentDepartmentId, this.currentIncidentId);
        this.currentDepartmentName = department.Key;
    }
}