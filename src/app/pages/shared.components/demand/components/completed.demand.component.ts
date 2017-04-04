import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { InvolvePartyModel } from '../../involveparties';
import { DemandModel, DemandModelToView, DemandRemarkLogModel } from './demand.model';
import { DemandService } from './demand.service';
import { CommunicationLogModel } from '../../communicationlogs';
import { DemandRemarkLogService } from './demand.remarklogs.service';
import { DemandTrailService } from './demandtrail.service';
import { DemandTrailModel } from './demand.trail.model';
import { ResponseModel, DataExchangeService, GlobalConstants } from '../../../../shared';

@Component({
    selector: 'completed-demand',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/completed.demand.view.html'
})
export class CompletedDemandComponent implements OnInit {
    completedDemands: DemandModelToView[];
    currentDepartmentId: number;
    currentDepartmentName: string;
    currentIncident: number;
    createdBy: number = 2;
    communicationLogs: CommunicationLogModel[];
    communicationLog: CommunicationLogModel;
    demandRemarks: DemandRemarkLogModel[];
    Remarks: string;
    RemarkToCreate: DemandRemarkLogModel;
    createdByName: string;
    demandTrail: DemandTrailModel;
    demandTrails: DemandTrailModel[];
    constructor(private demandService: DemandService, private demandRemarkLogsService: DemandRemarkLogService) {
        this.createdByName = "Anwesha Ray";
        this.demandRemarks = [];
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
        //  this.demandTrail.RequesterParentDepartmentName= demand.RequesterParentDepartmentName;
        this.demandTrail.TargetDepartmentName = demand.TargetDepartmentName;
        this.demandTrail.ApproverDepartmentName = demand.ApproverDepartmentName;
        //   this.demandTrail.RequesterType= demand.RequesterType;
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
        this.getDemandRemarks(demand.DemandId);
        demand["showRemarks"] = true;
    };

    cancel(demand) {
        demand["showRemarks"] = false;
    };

    ok(remarks, demand) {
        this.RemarkToCreate = new DemandRemarkLogModel();
        this.RemarkToCreate.Remark = remarks;
        this.RemarkToCreate.DemandId = demand.DemandId;
        this.RemarkToCreate.RequesterDepartmentName = demand.RequesterDepartmentName;
        this.RemarkToCreate.TargetDepartmentName = demand.TargetDepartmentName;
        this.RemarkToCreate.CreatedByName = this.createdByName;
        this.demandRemarkLogsService.Create(this.RemarkToCreate)
            .subscribe((response: DemandRemarkLogModel) => {
                alert("Remark saved successfully");
                this.getDemandRemarks(demand.DemandId);
                this.Remarks = "";
            }, (error: any) => {
                console.log("error:  " + error);
                alert("Error occured during saving the remark");
            });
    };

    isClosedOrRejected(item: DemandModelToView) {
        return (item.IsClosed == true || item.IsRejected == true);

    };

    SetCommunicationLog(demand: DemandModelToView): CommunicationLogModel[] {
        this.communicationLogs = new Array<CommunicationLogModel>();
        this.communicationLog = new CommunicationLogModel();
        this.communicationLog.InteractionDetailsId = 0;
        this.communicationLog.Queries = demand.DemandDesc;
        this.communicationLog.Answers = 'Closed by ' + this.currentDepartmentName + ", "
            + demand.DemandTypeName + " request for " + demand.TargetDepartmentName
            + ". Request Details : " + demand.DemandDesc + ". ";
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

    submit() {
        if (this.completedDemands.length > 0) {
            let demandCompletion: DemandModel[] = this.completedDemands.filter(this.isClosedOrRejected).map(x => {
                let item: DemandModel = new DemandModel();
                item.DemandId = x.DemandId;
                if (x.IsClosed) {
                    item.IsClosed = x.IsClosed;
                    item.ClosedBy = this.createdBy;
                    item.ClosedOn = new Date;
                    item.DemandStatusDescription = 'Closed by ' + this.currentDepartmentName;
                    item.CommunicationLogs = this.SetCommunicationLog(x);
                    x.DemandStatusDescription = item.DemandStatusDescription;
                    item.DemandTrails = this.createDemandTrailModel(x,true);
                }
                if (x.IsRejected) {
                    item.IsRejected = x.IsRejected;
                    item.IsCompleted = false;
                    item.RejectedBy = this.createdBy;
                    item.RejectedDate = new Date;
                    item.DemandStatusDescription = 'Approved and pending with ' + x.TargetDepartmentName;
                    x.DemandStatusDescription = item.DemandStatusDescription;
                    item.DemandTrails = this.createDemandTrailModel(x,false);
                }
                return item;
            });
            if (demandCompletion.length == 0) {
                alert("Please select at least one request");
            }
            else {
                this.demandService.UpdateBulkForClosure(demandCompletion)
                    .subscribe((response: DemandModel[]) => {
                        alert("Demand updated successfully");
                        this.getCompletedDemands(this.currentDepartmentId, this.currentIncident);
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            };
        }

    };

    ngOnInit() {
        this.currentDepartmentId = 4;
        this.currentDepartmentName = "Command Center";
        this.currentIncident = 1;
        this.getCompletedDemands(this.currentDepartmentId, this.currentIncident);

    };

}