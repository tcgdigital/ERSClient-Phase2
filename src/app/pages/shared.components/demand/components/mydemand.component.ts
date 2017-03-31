import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';


import { InvolvePartyModel } from '../../involveparties';
import { DemandModel, DemandModelToView, DemandRemarkLogModel } from './demand.model';

import { DemandService } from './demand.service';
import { DemandRemarkLogService } from './demand.remarklogs.service';

import { ResponseModel, DataExchangeService, GlobalConstants } from '../../../../shared';

@Component({
    selector: 'my-demand',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/mydemand.view.html'
})
export class MyDemandComponent implements OnInit {
    mydemands: DemandModelToView[];
    currentDepartment: number;
    currentDepartmentName: string;
    currentIncident: number;
    createdByName: string ="Anwesha Ray";
    createdBy: number;
    demandRemarks: DemandRemarkLogModel[] = [];
    Remarks: string;
    RemarkToCreate: DemandRemarkLogModel;    
    constructor(private demandService: DemandService,
        private demandRemarkLogsService: DemandRemarkLogService, private dataExchange: DataExchangeService<number>) {
    }


    getMyDemands(deptId, incidentId): void {
        this.demandService.GetByRequesterDepartment(deptId, incidentId)
            .subscribe((response: ResponseModel<DemandModel>) => {
                this.mydemands = this.demandService.DemandMapper(response.Records);
                this.mydemands.forEach(x =>
                    function () {
                        x["showRemarks"] = false;
                    });
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    setRagStatus(): void {
        Observable.interval(1000).subscribe(_ => {
            if (this.mydemands && this.mydemands.length > 0) {
                this.mydemands.forEach(x => {
                    if (x.ClosedOn == null) {
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

<<<<<<< HEAD
    open(demandId) {
        console.log("Event to publish" + demandId);
        this.dataExchange.Publish("OnDemandUpdate", demandId);
=======
    open(demandId) {   
         this.dataExchange.Publish("OnDemandUpdate", demandId);
>>>>>>> ec0391781432d11b378fc3419888d710fd2349e2
    };

    getDemandRemarks(demandId): void {
        this.demandRemarkLogsService.GetDemandRemarksByDemandId(demandId)
            .subscribe((response: ResponseModel<DemandRemarkLogModel>) => {
                debugger;
                this.demandRemarks = response.Records;
            }, (error: any) => {
                console.log("error:  " + error);
            });
    }

    openDemandRemarks(demand) {
        this.getDemandRemarks(demand.DemandId);
        demand["showRemarks"] = true;
    }
    cancel(demand) {
        demand["showRemarks"] = false;
    }
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
    }
    ngOnInit() {

        this.currentDepartment = 4;
        this.currentIncident = 1;
        this.getMyDemands(this.currentDepartment, this.currentIncident);
        this.Remarks = "";

    };

    ngAfterContentInit() {
        this.setRagStatus();
    };

}