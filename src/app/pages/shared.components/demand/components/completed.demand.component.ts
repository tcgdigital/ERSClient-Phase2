import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { InvolvePartyModel } from '../../involveparties';
import { DemandModel, DemandModelToView, DemandRemarkLogModel } from './demand.model';
import { DemandService } from './demand.service';
import { CommunicationLogModel } from '../../communicationlogs';
import { DemandRemarkLogService } from './demand.remarklogs.service';
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
                }
                if (x.IsRejected) {
                    item.IsRejected = x.IsRejected;
                    item.IsCompleted = false;
                    item.RejectedBy = this.createdBy;
                    item.RejectedDate = new Date;
                    item.DemandStatusDescription = 'Approved and pending with ' + x.TargetDepartmentName;
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
        this.currentDepartmentId = 1;
        this.currentDepartmentName = "Command Center";
        this.currentIncident = 88;
        this.getCompletedDemands(this.currentDepartmentId, this.currentIncident);

    };

}