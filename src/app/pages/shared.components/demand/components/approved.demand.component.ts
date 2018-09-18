import {
    Component, ViewEncapsulation, OnDestroy, Injector,
    OnInit, AfterContentInit, ViewChild
} from '@angular/core';
import { Subscription, Subject } from 'rxjs/Rx';
import * as moment from 'moment/moment';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DemandModel, DemandModelToView, DemandRemarkLogModel } from './demand.model';
import { CommunicationLogModel } from '../../communicationlogs';
import { DemandService } from './demand.service';
import { DemandTrailModel } from './demand.trail.model';
import { DemandRemarkLogService } from './demand.remarklogs.service';
import {
    ResponseModel, DataExchangeService,
    GlobalConstants, GlobalStateService,
    UtilityService, KeyValue, AuthModel,
} from '../../../../shared';
import { DepartmentService, DepartmentModel } from '../../../masterdata/department';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'approved-demand',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/approved.demand.view.html'
})
export class ApprovedDemandComponent implements OnInit, OnDestroy, AfterContentInit {
    @ViewChild('childModalRemarks') public childModalRemarks: ModalDirective;
    @ViewChild('childModal') public childModal: ModalDirective;

    demandsForApproval: DemandModelToView[] = [];
    currentDepartmentId: number;
    currentDepartmentName: string;
    currentIncidentId: number;
    createdBy: number;
    communicationLogs: CommunicationLogModel[];
    communicationLog: CommunicationLogModel;
    demandRemarks: DemandRemarkLogModel[];
    Remarks: string;
    RemarkToCreate: DemandRemarkLogModel;
    createdByName: string;
    demandTrails: DemandTrailModel[];
    demandForRemarks: DemandModelToView;
    demandTrail: DemandTrailModel;
    credential: AuthModel;
    protected _onRouteChange: Subscription;
    isArchive: boolean = false;
    demandFilePath: string;
    public globalStateProxyOpen: GlobalStateService;
    demand: DemandModelToView = new DemandModelToView();
    public isShowApprovedDemand: boolean = true;
    public isInvalidRemarks: boolean = false;
    public isDashboradApprovedDemandDownloadLink: boolean=true;

    private ngUnsubscribe: Subject<any> = new Subject<any>();
    
    /**
     * Creates an instance of ApprovedDemandComponent.
     * @param {DemandService} demandService
     * @param {DemandRemarkLogService} demandRemarkLogsService
     * @param {GlobalStateService} globalState
     * @param {DepartmentService} departmentService
     *
     * @memberOf ApprovedDemandComponent
     */
    constructor(private demandService: DemandService, private injector: Injector,
        private demandRemarkLogsService: DemandRemarkLogService,
        private globalState: GlobalStateService,
        private departmentService: DepartmentService,
        private toastrService: ToastrService,
        private dataExchange: DataExchangeService<number>,
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
        this.getDemandsForApproval(this.currentDepartmentId, this.currentIncidentId);
        this.credential = UtilityService.getCredentialDetails();
        this.createdBy = +this.credential.UserId;
        this.createdByName = this.credential.UserName;

        this.getCurrentDepartmentName(this.currentDepartmentId);
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard, 
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard, 
            (model: KeyValue) => this.departmentChangeHandler(model));

        // SignalR Notification
        this.globalState.Subscribe
        (GlobalConstants.NotificationConstant.ReceiveDemandApprovalPendingResponse.Key, (model: DemandModel) => {
            // this.getDemandsForApproval(model.ApproverDepartmentId, model.IncidentId);
            this.getDemandsForApproval(this.currentDepartmentId, this.currentIncidentId);
        });

        this.globalState.Subscribe
        (GlobalConstants.NotificationConstant.ReceiveDemandApprovedResponse.Key, (model: DemandModel) => {
            // this.getDemandsForApproval(model.ApproverDepartmentId, model.IncidentId);
            this.getDemandsForApproval(this.currentDepartmentId, this.currentIncidentId);
        });

        this.globalState.Subscribe
        (GlobalConstants.NotificationConstant.ReceiveDemandRejectedFromApprovalResponse.Key, (model: DemandModel) => {
            // this.getDemandsForApproval(model.ApproverDepartmentId, model.IncidentId);
            this.getDemandsForApproval(this.currentDepartmentId, this.currentIncidentId);
        });
    }

    public ngAfterContentInit(): any {
        // this.setRagStatus();
        // UtilityService.SetRAGStatus(this.demandsForApproval, 'Demand');
    }
    
    public getDemandsForApproval(deptId, incidentId): void {
        this.demandService.GetByApproverDepartment(deptId, incidentId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<DemandModel>) => {
                this.demandsForApproval = this.demandService.DemandMapper(response.Records);
                UtilityService.SetRAGStatus(this.demandsForApproval, 'Demand');
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    public cancelModal(): any {
        this.demand = new DemandModelToView();
        this.childModal.hide();
    }

    public getDemandRemarks(demandId): void {
        this.demandRemarkLogsService.GetDemandRemarksByDemandId(demandId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<DemandRemarkLogModel>) => {
                this.demandRemarks = response.Records;
                this.childModalRemarks.show();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    public openDemandRemarks(demand: DemandModelToView): void {
        this.demandForRemarks = demand;
        this.getDemandRemarks(demand.DemandId);
    }

    public createDemandTrailModel(demand: DemandModelToView, flag, originalDemand?: DemandModel): DemandTrailModel[] {
        this.demandTrails = [];
        this.demandTrail = new DemandTrailModel();
        this.demandTrail.Answers = '';
        this.demandTrail.DemandId = demand.DemandId;
        this.demandTrail.IncidentId = this.currentIncidentId;
        this.demandTrail.ScheduleTime = demand.ScheduleTime;
        this.demandTrail.ContactNumber = demand.ContactNumber;
        this.demandTrail.Priority = demand.Priority;
        this.demandTrail.RequesterName = demand.RequestedBy;
        this.demandTrail.RequesterDepartmentName = demand.RequesterDepartmentName;
        this.demandTrail.TargetDepartmentName = demand.TargetDepartmentName;
        this.demandTrail.ApproverDepartmentName = flag ? this.currentDepartmentName : null;
        this.demandTrail.DemandDesc = demand.DemandDesc;
        this.demandTrail.IsApproved = demand.IsApproved;
        this.demandTrail.ApprovedDt = flag ? new Date() : null;
        this.demandTrail.IsCompleted = false;
        this.demandTrail.ScheduledClose = null;
        this.demandTrail.IsClosed = false;
        this.demandTrail.ClosedOn = null;
        this.demandTrail.IsRejected = demand.IsRejected;
        this.demandTrail.RejectedDate = flag ? null : new Date();
        this.demandTrail.RejectedByDepartmentName = flag ? null : this.currentDepartmentName;
        this.demandTrail.DemandStatusDescription = demand.DemandStatusDescription;
        this.demandTrail.Remarks = demand.Remarks;
        this.demandTrail.ActiveFlag = 'Active';
        this.demandTrail.CreatedBy = this.createdBy;
        this.demandTrail.CreatedOn = demand.CreatedOn;

        const date = new Date();
        const answer = `<div><p> ${demand.DemandStatusDescription}   <strong>Date :</strong>  ${moment(date).format('DD-MMM-YYYY HH:mm')}  </p><div>`;

        this.demandTrail.Answers = answer;
        this.demandTrails.push(this.demandTrail);
        return this.demandTrails;
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
        this.RemarkToCreate.CreatedBy = +this.credential.UserId;
        
        this.demandRemarkLogsService.Create(this.RemarkToCreate)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: DemandRemarkLogModel) => {
                this.getDemandRemarks(demand.DemandId);
                this.Remarks = '';
            }, (error: any) => {
                console.log(`Error: ${error}`);
                alert('Error occured during saving the remark');
            });
    }

    public isApprovedOrRejected(item: DemandModelToView): any {
        return (item.IsApproved === true || item.IsRejected === true);
    }

    public SetCommunicationLog(demand: DemandModelToView): CommunicationLogModel[] {
        this.communicationLogs = new Array<CommunicationLogModel>();
        this.communicationLog = new CommunicationLogModel();
        this.communicationLog.InteractionDetailsId = 0;
        this.communicationLog.Queries = demand.DemandDesc;
        this.communicationLog.Answers = `${demand.DemandStatusDescription}, ${demand.DemandTypeName} request for ${demand.TargetDepartmentName}. Demand Details : ${demand.DemandDesc}. Demand Code ${demand.DemandCode}`;
        this.communicationLog.RequesterName = demand.RequestedBy;
        this.communicationLog.RequesterDepartment = demand.TargetDepartmentName;
        this.communicationLog.RequesterType = 'Demand';
        this.communicationLog.DemandId = demand.DemandId;
        this.communicationLog.CreatedBy = +this.credential.UserId;
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
    }

    public submit(): void {
        if (this.demandsForApproval.length > 0) {
            const demandCompletion: DemandModel[] = this.demandsForApproval.filter(this.isApprovedOrRejected).map((x) => {
                const item: DemandModel = new DemandModel();
                item.DemandId = x.DemandId;
                item.Remarks = x.Remarks;
                item.IsApproved = x.IsApproved;
                item.IsRejected = x.IsRejected;
                x.IsApproved ? item.ApprovedDt = new Date() : item.RejectedDate = new Date();
                x.IsApproved ? item.ApprovedBy = this.createdBy : item.RejectedBy = this.createdBy;
                item.ApproverDepartmentId = x.IsApproved ? this.currentDepartmentId : item.ApproverDepartmentId;
                item.DemandStatusDescription = item.IsApproved ? `Approved by ${this.createdByName} (${this.currentDepartmentName}) and pending with ${x.TargetDepartmentName}` :
                    `Rejected by ${this.createdByName} (${this.currentDepartmentName})`;
                x.DemandStatusDescription = item.DemandStatusDescription;
                item.CommunicationLogs = this.SetCommunicationLog(x);
                item.DemandTrails = x.IsApproved ? this.createDemandTrailModel(x, true) : this.createDemandTrailModel(x, false);
                return item;
            });

            if (demandCompletion.length === 0) {
                this.toastrService.error('Please select at least one request');
            }
            else {
                this.demandService.UpdateBulkForApproval(demandCompletion)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe((response: DemandModel[]) => {
                        this.toastrService.success('Demand status successfully updated.', 'Success', this.toastrConfig);
                        this.getDemandsForApproval(this.currentDepartmentId, this.currentIncidentId);
                        this.globalStateProxyOpen.NotifyDataChanged(GlobalConstants.DataExchangeConstant.DemandApproved, null);
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            }
        }
        else {
            this.toastrService.error('There is no request to be approved');
        }
    }

    public getCurrentDepartmentName(departmentId): void {
        this.departmentService.Get(departmentId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: DepartmentModel) => {
                this.currentDepartmentName = response.DepartmentName;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    public ngOnDestroy(): void {
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard);
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public openDemandDetails(demandId: number): void {
        this.demand = this.demandsForApproval.find((x) => x.DemandId === demandId);
        this.childModal.show();
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getDemandsForApproval(this.currentDepartmentId, this.currentIncidentId);
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getDemandsForApproval(this.currentDepartmentId, this.currentIncidentId);
        this.currentDepartmentName = department.Key;
    }
}
