import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { Observable } from 'rxjs/RX';

import { InvolvePartyModel } from '../../involveparties';
import { DemandModel, DemandModelToView, DemandRemarkLogModel } from './demand.model';
import { DemandService } from './demand.service';
import { DemandRemarkLogService } from './demand.remarklogs.service';
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
    constructor(private demandService: DemandService, private demandRemarkLogsService: DemandRemarkLogService) {
        this.createdByName = "Anwesha Ray";
        this.demandRemarks = [];
    }


    getAssignedDemands(deptId, incidentId): void {
        this.demandService.GetForAssignedDept(deptId, incidentId)
            .subscribe((response: ResponseModel<DemandModel>) => {
                this.demands = this.demandService.DemandMapper(response.Records);
                // console.log(this.demands);
            }, (error: any) => {
                console.log("error:  " + error);
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
                    console.log(x);

                });
            }
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

    isCompleted(item: DemandModelToView) {
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
                        console.log(error);
                    });
            };
        }

    };

    ngOnInit() {
        this.currentDepartmentId = 4;
        this.currentDepartmentName = "Command Center";
        this.currentIncident = 1;
        this.getAssignedDemands(this.currentDepartmentId, this.currentIncident);

    };

    ngAfterContentInit() {
        console.log(this.demands);
        this.setRagStatus();
    };

}