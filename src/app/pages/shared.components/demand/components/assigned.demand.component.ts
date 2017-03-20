import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { Observable } from 'rxjs/RX';

import { InvolvePartyModel } from '../../involveparties';
import { DemandModel, DemandModelToView } from './demand.model';
import { DemandService } from './demand.service';
import { ResponseModel, DataExchangeService, GlobalConstants } from '../../../../shared';

@Component({
    selector: 'assigned-demand',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/assigned.demand.view.html'
})
export class AssignedDemandComponent implements OnInit, AfterContentInit {

    constructor(private demandService: DemandService) { }
    demands: DemandModelToView[];
    currentDepartmentId: number;
    currentDepartmentName: string;
    currentIncident: number;

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
                        this.getAssignedDemands(this.currentDepartmentId,this.currentIncident);
                    }, (error: any) => {
                        console.log(error);
                    });
            };
        }

    };

    ngOnInit() {
        this.currentDepartmentId = 1;
    this.currentDepartmentName = "Command Center";
    this.currentIncident = 88;
        this.getAssignedDemands(this.currentDepartmentId,this.currentIncident);

    };

    ngAfterContentInit() {
        console.log(this.demands);
        this.setRagStatus();
    };

}