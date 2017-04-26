import {
    Component, ViewEncapsulation,
    OnInit, ViewChild, OnDestroy
} from '@angular/core';
import { ToastrService, ToastrConfig } from 'ngx-toastr';


import { InvolvePartyModel } from '../../involveparties';
import { DemandModel, DemandModelToView, DemandRemarkLogModel } from './demand.model';
import { DemandService } from './demand.service';
import { CommunicationLogModel } from '../../communicationlogs';
import { DemandRemarkLogService } from './demand.remarklogs.service';
import { DemandTrailService } from './demandtrail.service';
import { DemandTrailModel } from './demand.trail.model';
import {
    ResponseModel, DataExchangeService, KeyValue,
    GlobalConstants, GlobalStateService, UtilityService
} from '../../../../shared';
import { DepartmentService, DepartmentModel } from '../../../masterdata/department';
import { ModalDirective } from 'ng2-bootstrap/modal';



@Component({
    selector: 'completed-demand',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/completed.demand.view.html'
})
export class CompletedDemandComponent implements OnInit, OnDestroy {
    @ViewChild('childModalRemarks') public childModalRemarks: ModalDirective;

    completedDemands: DemandModelToView[] = [];
    currentDepartmentId: number;
    currentDepartmentName: string;
    currentIncidentId: number;
    createdBy: number = 2;
    communicationLogs: CommunicationLogModel[];
    communicationLog: CommunicationLogModel;
    demandRemarks: DemandRemarkLogModel[];
    Remarks: string;
    RemarkToCreate: DemandRemarkLogModel;
    createdByName: string;
    demandTrail: DemandTrailModel;
    demandTrails: DemandTrailModel[];
    demandForRemarks: DemandModelToView;

    /**
     * Creates an instance of CompletedDemandComponent.
     * @param {DemandService} demandService 
     * @param {DemandRemarkLogService} demandRemarkLogsService 
     * @param {GlobalStateService} globalState 
     * @param {DepartmentService} departmentService 
     * 
     * @memberOf CompletedDemandComponent
     */
    constructor(private demandService: DemandService,
        private demandRemarkLogsService: DemandRemarkLogService,
        private globalState: GlobalStateService,
        private departmentService: DepartmentService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) {
        this.createdByName = "Anwesha Ray";
        this.demandRemarks = [];
        this.demandForRemarks = new DemandModelToView();
    }

    getCompletedDemands(deptId, incidentId): void {
        this.demandService.GetCompletedDemands(deptId, incidentId)
            .subscribe((response: ResponseModel<DemandModel>) => {
                this.completedDemands = this.demandService.DemandMapper(response.Records);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    getDemandRemarks(demandId): void {
        this.demandRemarkLogsService.GetDemandRemarksByDemandId(demandId)
            .subscribe((response: ResponseModel<DemandRemarkLogModel>) => {
                this.demandRemarks = response.Records;
                this.childModalRemarks.show();
            }, (error: any) => {
                console.log("error:  " + error);
            });
    };

    createDemandTrailModel(demand: DemandModelToView, flag): DemandTrailModel[] {
        this.demandTrails = [];
        this.demandTrail = new DemandTrailModel();
        let createdOn = new Date(demand.CreatedOn);
        let totaTime = createdOn.getTime() + Number(demand.ScheduleTime) * 60000;
        let scheduleClose: Date = new Date();
        scheduleClose.setTime(totaTime);
        this.demandTrail.Answers = "";
        this.demandTrail.DemandId = demand.DemandId;
        this.demandTrail.ContactNumber = demand.ContactNumber;
        this.demandTrail.Priority = demand.Priority;
        this.demandTrail.RequesterName = demand.RequestedBy;
        this.demandTrail.RequesterDepartmentName = demand.RequesterDepartmentName;
        this.demandTrail.TargetDepartmentName = demand.TargetDepartmentName;
        this.demandTrail.ApproverDepartmentName = demand.ApproverDepartmentName;
        this.demandTrail.DemandDesc = demand.DemandDesc;
        this.demandTrail.IsApproved = demand.IsApproved;
        this.demandTrail.IsCompleted = demand.IsCompleted;
        this.demandTrail.ScheduledClose = scheduleClose;
        this.demandTrail.IsClosed = flag;
        this.demandTrail.ClosedOn = flag ? new Date() : null;
        this.demandTrail.ClosedByDepartmentName = flag ? this.currentDepartmentName : null;
        this.demandTrail.IsRejected = demand.IsRejected;
        this.demandTrail.RejectedDate = flag ? null : new Date();
        this.demandTrail.RejectedByDepartmentName = flag ? null : this.currentDepartmentName;
        this.demandTrail.DemandStatusDescription = demand.DemandStatusDescription;
        this.demandTrail.Remarks = demand.Remarks;
        this.demandTrail.ActiveFlag = "Active";
        this.demandTrail.CreatedBy = demand.CreatedBy;
        this.demandTrail.CreatedOn = demand.CreatedOn

        let date = new Date();
        let answer = '<div><p>' + demand.DemandStatusDescription + '   <strong>Date :</strong>  ' + date.toLocaleString() + '  </p><div>';
        this.demandTrail.Answers = answer;
        this.demandTrails.push(this.demandTrail);
        return this.demandTrails;
    };

    openDemandRemarks(demand) {
        this.demandForRemarks = demand;
        this.getDemandRemarks(demand.DemandId);
    };

    cancelRemarkUpdate(): void {
        this.childModalRemarks.hide();
    };

    saveRemark(remarks): void {
        let demand: DemandModelToView = this.demandForRemarks;
        this.RemarkToCreate = new DemandRemarkLogModel();
        this.RemarkToCreate.Remark = remarks;
        this.RemarkToCreate.DemandId = demand.DemandId;
        this.RemarkToCreate.RequesterDepartmentName = demand.RequesterDepartmentName;
        this.RemarkToCreate.TargetDepartmentName = demand.TargetDepartmentName;
        this.RemarkToCreate.CreatedByName = this.createdByName;
        this.demandRemarkLogsService.Create(this.RemarkToCreate)
            .subscribe((response: DemandRemarkLogModel) => {
                this.toastrService.success('Remark saved successfully.', 'Success', this.toastrConfig);
                this.getDemandRemarks(demand.DemandId);
                this.Remarks = "";
            }, (error: any) => {
                console.log("error:  " + error);
                alert("Error occured during saving the remark");
            });
    };

    isClosedOrRejected(item: DemandModelToView): any {
        return (item.IsClosed == true || item.IsRejected == true);

    };

    SetCommunicationLog(demand: DemandModelToView): CommunicationLogModel[] {
        this.communicationLogs = new Array<CommunicationLogModel>();
        this.communicationLog = new CommunicationLogModel();
        this.communicationLog.InteractionDetailsId = 0;
        this.communicationLog.Queries = demand.DemandDesc;
        this.communicationLog.Answers = `Closed by ${this.currentDepartmentName}, ${demand.DemandTypeName} request for ${demand.TargetDepartmentName}. Request Details : ${demand.DemandDesc}.`;
        this.communicationLog.RequesterName = demand.RequestedBy;
        this.communicationLog.RequesterDepartment = demand.TargetDepartmentName;
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

    submit(): void {
        if (this.completedDemands.length > 0) {
            let demandCompletion: DemandModel[] = this.completedDemands.filter(this.isClosedOrRejected).map(x => {
                let item: DemandModel = new DemandModel();
                item.DemandId = x.DemandId;
                if (x.IsClosed) {
                    item.IsClosed = x.IsClosed;
                    item.ClosedBy = this.createdBy;
                    item.ClosedOn = new Date;
                    item.DemandStatusDescription = `Closed by ${this.currentDepartmentName}`;
                    item.CommunicationLogs = this.SetCommunicationLog(x);
                    x.DemandStatusDescription = item.DemandStatusDescription;
                    item.DemandTrails = this.createDemandTrailModel(x, true);
                }
                if (x.IsRejected) {
                    item.IsRejected = x.IsRejected;
                    item.IsCompleted = false;
                    item.RejectedBy = this.createdBy;
                    item.RejectedDate = new Date;
                    item.DemandStatusDescription = `Approved and pending with ${x.TargetDepartmentName}`;
                    x.DemandStatusDescription = item.DemandStatusDescription;
                    item.DemandTrails = this.createDemandTrailModel(x, false);
                }
                return item;
            });
            if (demandCompletion.length == 0) {
                alert("Please select at least one request");
            }
            else {
                this.demandService.UpdateBulkForClosure(demandCompletion)
                    .subscribe((response: DemandModel[]) => {
                        this.toastrService.success('Demand updated successfully.', 'Success', this.toastrConfig);
                        this.getCompletedDemands(this.currentDepartmentId, this.currentIncidentId);
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            };
        }
    };


    ngOnInit() {
        this.currentIncidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");

        this.currentDepartmentName = "Command Center";
        this.getCompletedDemands(this.currentDepartmentId, this.currentIncidentId);
        this.getCurrentDepartmentName(this.currentDepartmentId);

        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    };

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getCompletedDemands(this.currentDepartmentId, this.currentIncidentId);
    };

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getCompletedDemands(this.currentDepartmentId, this.currentIncidentId);
        this.getCurrentDepartmentName(this.currentDepartmentId);
    };

    getCurrentDepartmentName(departmentId): void {
        this.departmentService.Get(departmentId)
            .subscribe((response: DepartmentModel) => {
                this.currentDepartmentName = response.DepartmentName;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }
}