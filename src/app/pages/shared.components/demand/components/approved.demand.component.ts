import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { InvolvePartyModel } from '../../involveparties';
import { DemandModel, DemandModelToView } from './demand.model';
import { CommunicationLogModel } from '../../communicationlogs';
import { DemandService } from './demand.service';
import { ResponseModel, DataExchangeService, GlobalConstants } from '../../../../shared';

@Component({
    selector: 'approved-demand',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/approved.demand.view.html'
})
export class ApprovedDemandComponent implements OnInit, AfterContentInit {

    constructor(private demandService: DemandService) { }
    demandsForApproval: DemandModelToView[];
    currentDepartmentId: number;
    currentIncident: number ;
    createdBy: number = 2;
    currentDepartmentName: string;
    communicationLogs: CommunicationLogModel[];
    communicationLog: CommunicationLogModel;

    getDemandsForApproval(deptId, incidentId): void {
        this.demandService.GetByApproverDepartment(deptId,incidentId)
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

    remarks(id) {

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
                return item;
            });

            if (demandCompletion.length == 0) {
                alert("Please select at least one request");
            }
            else {
                this.demandService.UpdateBulkForApproval(demandCompletion)
                    .subscribe((response: DemandModel[]) => {
                        this.getDemandsForApproval(this.currentDepartmentId,this.currentIncident);
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            };
        }
    };

    ngOnInit() {
        
        this.currentDepartmentId=1;
        this.currentIncident = 1;
        this.getDemandsForApproval(this.currentDepartmentId,this.currentIncident);
        this.currentDepartmentName = "Command Center";
    };

    ngAfterContentInit() {
        this.setRagStatus();
    };


}