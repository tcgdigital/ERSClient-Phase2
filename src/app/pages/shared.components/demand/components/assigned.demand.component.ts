import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { InvolvePartyModel } from '../../involveparties';
import { DemandModel, DemandModelToView, DemandRemarkLogModel } from './demand.model';
import { DemandService } from './demand.service';
import { DemandTrailService } from './demandtrail.service';
import { DemandTrailModel } from './demand.trail.model';
import { DemandRemarkLogService } from './demand.remarklogs.service';
import { DepartmentService, DepartmentModel } from '../../../masterdata/department';
import { ResponseModel, DataExchangeService, GlobalConstants } from '../../../../shared';

@Component({
    selector: 'assigned-demand',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/assigned.demand.view.html'
})
export class AssignedDemandComponent implements OnInit, AfterContentInit {
    demands: DemandModelToView[];
    currentDepartmentId: number;
    currentDepartmentName: string;
    currentIncident: number;
    Remarks: string;
    demandRemarks: DemandRemarkLogModel[];
    RemarkToCreate: DemandRemarkLogModel;
    createdByName: string;
    demandTrail: DemandTrailModel;
    demandTrails: DemandTrailModel[];
    departments: DepartmentModel[];
    constructor(private demandService: DemandService, private departmentService: DepartmentService,
        private demandRemarkLogsService: DemandRemarkLogService) {
        this.createdByName = "Anwesha Ray";
        this.demandRemarks = [];
    }


    getAssignedDemands(deptId, incidentId): void {
        this.demandService.GetForAssignedDept(deptId, incidentId)
            .subscribe((response: ResponseModel<DemandModel>) => {
                this.demands = this.demandService.DemandMapper(response.Records);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    setRagStatus(): void {
        Observable.interval(1000).subscribe(_ => {
            // alert("interval");
            if (this.demands && this.demands.length > 0) {
                this.demands.forEach(x => {
                    if (x.ClosedOn == null) {
                        //alert("ifff");
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
            }
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

    getAllDepartments() {
        this.departmentService.GetAll()
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                this.departments = response.Records;
            }, (error: any) => {
                console.log("error:  " + error);
            });
    }


    createDemandTrailModel(demand: DemandModelToView, flag, OriginalDemand ?: DemandModel): DemandTrailModel[] {
        this.demandTrails = [];
        this.demandTrail = new DemandTrailModel();
        let description = flag ? 'Completed by ' + this.currentDepartmentName : demand.DemandDesc;
        //  let RequesterParentDepartmentName = flag ? demand.RequesterParentDepartmentName : 
        //          (this.departments.find(x=>{return x.DepartmentId == OriginalDemand.RequesterParentDepartmentId;}) 
        //           ?this.departments.find(x=>{return x.DepartmentId == OriginalDemand.RequesterParentDepartmentId;}).DepartmentName : null);

        this.demandTrail.Answers = "";
        this.demandTrail.DemandId = demand.DemandId;
        this.demandTrail.ScheduleTime = demand.ScheduleTime;
        this.demandTrail.ContactNumber = demand.ContactNumber;
        this.demandTrail.Priority = demand.Priority;
        this.demandTrail.RequiredLocation = demand.RequiredLocation;
        this.demandTrail.RequesterDepartmentName = demand.RequesterDepartmentName;
        //  this.demandTrail.RequesterParentDepartmentName = RequesterParentDepartmentName ;
        this.demandTrail.TargetDepartmentName = this.currentDepartmentName;
        this.demandTrail.ApproverDepartmentName = this.departments.find(x => { return x.DepartmentId == demand.ApproverDeptId; }) ?
            this.departments.find(x => { return x.DepartmentId == demand.ApproverDeptId; }).DepartmentName : null;
        this.demandTrail.DemandDesc = demand.DemandDesc;
        this.demandTrail.IsCompleted = true;
        this.demandTrail.ScheduledClose = new Date();
        this.demandTrail.IsClosed = false;
        this.demandTrail.ClosedOn = null;
        this.demandTrail.DemandStatusDescription = description;
        this.demandTrail.Remarks = demand.Remarks;
        this.demandTrail.ActiveFlag = "Active";
        this.demandTrail.CreatedOn = demand.CreatedOn

        var date = new Date();
        var answer = '<div><p>Request ' + this.demandTrail.DemandStatusDescription + '   <strong>Date :</strong>  ' + date.toLocaleString() + '  </p><div>';
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
            answer = '<div><p> Request Edited By ' + this.currentDepartmentName + '  <strong>Date :</strong>  ' + date + '  </p><div>';
            if (OriginalDemand.ScheduleTime) {
                var minutesInt = parseInt(OriginalDemand.ScheduleTime);
                var d = new Date(OriginalDemand.CreatedOn);
                d.setMinutes(d.getMinutes() + minutesInt);
                var editedDate = new Date(d);
                answer = answer + '<strong>Expected Resolution Time</strong> : ' + editedDate + '  ';
            }
        }

        this.demandTrail.Answers = answer;
        this.demandTrails.push(this.demandTrail);
        return this.demandTrails;


    };

    openDemandRemarks(demand) {
        this.getDemandRemarks(demand.DemandId);
        demand["showRemarks"] = true;
    };

    cancelRemarkUpdate(demand) : void {
        demand["showRemarks"] = false;
    };
    
    saveRemark(remarks, demand) : void {

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

    isCompleted(item: DemandModelToView) : any {
        return item.IsCompleted == true;

    };

    submit(): void {
        if (this.demands.length > 0) {
            let demandCompletion: DemandModel[] = this.demands.filter(this.isCompleted).map(x => {
                let item: DemandModel = new DemandModel();
                item.DemandId = x.DemandId;
                item.ScheduledClose = new Date(),
                    item.ClosedByDepartmentId = this.currentDepartmentId;
                item.DemandStatusDescription = 'Completed by ' + this.currentDepartmentName,
                    item.IsCompleted = x.IsCompleted,
                    item.IsRejected = false;
                item.RejectedDate = null;
                item.RejectedBy = null;
                item.Remarks = x.Remarks;
                item.DemandTrails = this.createDemandTrailModel(x,true);
                return item;
            });

            if (demandCompletion.length == 0) {
                alert("Please select at least one request");
            }
            else {
                this.demandService.UpdateBulkForCompletion(demandCompletion)
                    .subscribe((response: DemandModel[]) => {
                        this.getAssignedDemands(this.currentDepartmentId, this.currentIncident);
                    }, (error: any) => {
                        console.log(`Error: ${error}`);
                    });
            };
        }
    };

    ngOnInit() : any {
        this.currentDepartmentId = 4;
        this.currentDepartmentName = "Command Center";
        this.currentIncident = 1;
        this.getAssignedDemands(this.currentDepartmentId, this.currentIncident);
        this.getAllDepartments();

    };

    ngAfterContentInit() : any {
        this.setRagStatus();
    };
}