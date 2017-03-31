import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { Observable } from 'rxjs/RX';
import { InvolvePartyModel } from '../../involveparties';
import { DemandModel, DemandModelToView, DemandRemarkLogModel } from './demand.model';
import { CommunicationLogModel } from '../../communicationlogs';
import { DemandService } from './demand.service';
import { DemandTrailService } from './demandtrail.service';
import { DemandTrailModel } from './demand.trail.model';
import { DemandRemarkLogService } from './demand.remarklogs.service';
import { ResponseModel, DataExchangeService, GlobalConstants } from '../../../../shared';

@Component({
    selector: 'approved-demand',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/approved.demand.view.html'
})
export class ApprovedDemandComponent implements OnInit, AfterContentInit {
    demandsForApproval: DemandModelToView[];
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
    demandTrails: DemandTrailModel[];
    demandTrail: DemandTrailModel;
    constructor(private demandService: DemandService, private demandRemarkLogsService: DemandRemarkLogService) {
        this.createdByName = "Anwesha Ray";
        this.demandRemarks = [];
    }


    getDemandsForApproval(deptId, incidentId): void {
        this.demandService.GetByApproverDepartment(deptId, incidentId)
            .subscribe((response: ResponseModel<DemandModel>) => {
                this.demandsForApproval = this.demandService.DemandMapper(response.Records);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    setRagStatus(): void {
        Observable.interval(1000).subscribe(_ => {
            this.demandsForApproval.forEach(x =>
                function () {
                    if (x.ClosedOn == undefined || x.ClosedOn == null) {
                        let ScheduleTime: number = (Number(x.ScheduleTime) * 60000);
                        let CreatedOn: number = new Date(x.CreatedOn).getTime();
                        let CurrentTime: number = new Date().getTime();
                        let TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
                        let percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));
                        if (percentage < 50) {
                            x.RagStatus = 'statusGreen';
                        } else if (percentage >= 100) {
                            x.RagStatus = 'statusRed';
                        }
                        else {
                            x.RagStatus = 'statusAmber';
                        }
                    }
                    else {
                        let ScheduleTime: number = (Number(x.ScheduleTime) * 60000);
                        let CreatedOn: number = new Date(x.CreatedOn).getTime();
                        let CurrentTime: number = new Date().getTime();
                        let TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
                        let percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));
                        if (percentage < 50) {
                            x.RagStatus = 'statusGreen';
                        } else if (percentage >= 100) {
                            x.RagStatus = 'statusRed';
                        }
                        else {
                            x.RagStatus = 'statusAmber';
                        }
                    }
                });
        });
    };

    getDemandRemarks(demandId): void {
        this.demandRemarkLogsService.GetDemandRemarksByDemandId(demandId)
            .subscribe((response: ResponseModel<DemandRemarkLogModel>) => {
                debugger;
                this.demandRemarks = response.Records;
            }, (error: any) => {
                console.log("error:  " + error);
            });
    };

    openDemandRemarks(demand) {
        this.getDemandRemarks(demand.DemandId);
        demand["showRemarks"] = true;
    };
    createDemandTrailModel(demand: DemandModelToView, flag, originalDemand?: DemandModel): DemandTrailModel[] {

        this.demandTrails = [];
        this.demandTrail = new DemandTrailModel();
        this.demandTrail.Answers = "";
        this.demandTrail.DemandId = demand.DemandId;
        this.demandTrail.IncidentId = this.currentIncident;
        this.demandTrail.ScheduleTime = demand.ScheduleTime;
        this.demandTrail.ContactNumber = demand.ContactNumber;
        this.demandTrail.Priority = demand.Priority;
        this.demandTrail.RequesterName = demand.RequestedBy;
        this.demandTrail.RequesterDepartmentName = demand.RequesterDepartmentName;
        //this.demandTrail.RequesterParentDepartmentName = demand.RequesterParentDepartmentName ;
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
        this.demandTrail.ActiveFlag = "Active";
        this.demandTrail.CreatedBy = this.createdBy;
        this.demandTrail.CreatedOn = demand.CreatedOn

        let date = new Date();
        let answer = '<div><p>' + demand.DemandStatusDescription + '   <strong>Date :</strong>  ' + date.toLocaleString() + '  </p><div>';
        if (originalDemand != undefined) {
            this.demandTrail.DemandTypeId = originalDemand.DemandTypeId;
            this.demandTrail.DemandCode = originalDemand.DemandCode;
            this.demandTrail.IsRejected = false;
            this.demandTrail.IsApproved = false;
            this.demandTrail.ApprovedDt = null;
            this.demandTrail.RejectedDate = null;
            this.demandTrail.ContactNumber = originalDemand.ContactNumber;
            this.demandTrail.DemandStatusDescription = originalDemand.DemandStatusDescription;
            this.demandTrail.RequiredLocation = originalDemand.RequiredLocation;
            this.demandTrail.RequesterType = originalDemand.RequesterType;
            answer = '<div><p> Request Edited By ' + this.demandTrail.RequesterDepartmentName + '  <strong>Date :</strong>  ' + date + '  </p><div>';
            if (originalDemand.ScheduleTime) {
                var minutesInt = parseInt(originalDemand.ScheduleTime);
                var d = new Date(originalDemand.CreatedOn);
                d.setMinutes(d.getMinutes() + minutesInt);
                var editedDate = new Date(d);
                answer = answer + '<strong>Expected Resolution Time</strong> : ' + editedDate + '  ';
            }
        }
        this.demandTrail.Answers = answer;
        this.demandTrails.push(this.demandTrail);
        return this.demandTrails;
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

    isApprovedOrRejected(item: DemandModelToView) {
        return (item.IsApproved == true || item.IsRejected == true);

    };

    SetCommunicationLog(demand: DemandModelToView): CommunicationLogModel[] {
        this.communicationLogs = new Array<CommunicationLogModel>();
        this.communicationLog = new CommunicationLogModel();
        this.communicationLog.InteractionDetailsId = 0;
        this.communicationLog.Queries = demand.DemandDesc;
        this.communicationLog.Answers = demand.DemandStatusDescription + ", "
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
        if (this.demandsForApproval.length > 0) {
            let demandCompletion: DemandModel[] = this.demandsForApproval.filter(this.isApprovedOrRejected).map(x => {
                let item: DemandModel = new DemandModel();
                item.DemandId = x.DemandId;
                item.Remarks = x.Remarks;
                item.IsApproved = x.IsApproved;
                item.IsRejected = x.IsRejected;
                x.IsApproved ? item.ApprovedDt = new Date() : item.RejectedDate = new Date;
                x.IsApproved ? item.ApprovedBy = this.createdBy : item.RejectedBy = this.createdBy;
                item.ApproverDepartmentId = x.IsApproved ? this.currentDepartmentId : item.ApproverDepartmentId;
                item.DemandStatusDescription = item.IsApproved ? 'Approved and pending with ' + x.TargetDepartmentName :
                    'On Hold by ' + this.currentDepartmentName;
                item.CommunicationLogs = this.SetCommunicationLog(x);
                item.DemandTrails = x.IsApproved ? this.createDemandTrailModel(x, true) : this.createDemandTrailModel(x, false);
                return item;
            });

            if (demandCompletion.length == 0) {
                alert("Please select at least one request");
            }
            else {
                this.demandService.UpdateBulkForApproval(demandCompletion)
                    .subscribe((response: DemandModel[]) => {
                        this.getDemandsForApproval(this.currentDepartmentId, this.currentIncident);
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            };
        }
    };

    ngOnInit() {

        this.currentDepartmentId = 1;
        this.currentIncident = 1;
        this.getDemandsForApproval(this.currentDepartmentId, this.currentIncident);
        this.currentDepartmentName = "Command Center";
    };

    ngAfterContentInit() {
        this.setRagStatus();
    };


}