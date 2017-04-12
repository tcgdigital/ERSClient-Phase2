import { Component, ViewEncapsulation, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';


import { InvolvePartyModel } from '../../involveparties';
import { DemandModel, DemandModelToView, DemandRemarkLogModel } from './demand.model';

import { DemandService } from './demand.service';
import { DemandRemarkLogService } from './demand.remarklogs.service';
import { DemandTrailService } from './demandtrail.service';
import { DemandTrailModel } from './demand.trail.model';

import { ResponseModel, DataExchangeService, GlobalConstants, GlobalStateService, UtilityService } from '../../../../shared';
import { DepartmentService, DepartmentModel } from '../../../masterdata/department';
import { ModalDirective } from 'ng2-bootstrap/modal';



@Component({
    selector: 'my-demand',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/mydemand.view.html'
})
export class MyDemandComponent implements OnInit {
    @ViewChild('childModalRemarks') public childModalRemarks: ModalDirective;
     @ViewChild('childModalTrail') public childModalTrail: ModalDirective;
    

    mydemands: DemandModelToView[] = [];
    currentDepartmentId: number;
    currentIncidentId: number;
    createdByName: string = "Anwesha Ray";
    createdBy: number;
    demandRemarks: DemandRemarkLogModel[] = [];
    Remarks: string;
    RemarkToCreate: DemandRemarkLogModel;
    demandTrails: DemandTrailModel[];
    demandForRemarks: DemandModelToView;
    demandTypeName : string ="";
        requesterDepartmentName : string ="";
    constructor(private demandService: DemandService,
        private demandRemarkLogsService: DemandRemarkLogService, private dataExchange: DataExchangeService<number>,
        private demandTrailService: DemandTrailService, private globalState: GlobalStateService) {
        this.demandForRemarks = new DemandModelToView();
    }


    getMyDemands(deptId, incidentId): void {
        this.demandService.GetByRequesterDepartment(deptId, incidentId)
            .subscribe((response: ResponseModel<DemandModel>) => {
                this.mydemands = this.demandService.DemandMapper(response.Records);
                this.mydemands.forEach(x =>
                    function () {
                        x["showRemarks"] = false;
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


    open(demandId) {
        this.dataExchange.Publish("OnDemandUpdate", demandId);

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


    getDemandTrails(demandId): void {
        this.demandTrailService.getDemandTrailByDemandId(demandId)
            .subscribe((response: ResponseModel<DemandTrailModel>) => {
                this.demandTrails = response.Records;
                this.childModalTrail.show();
            }, (error: any) => {
                console.log("error:  " + error);
            });
    }

    cancelTrail() : void {
        this.childModalTrail.hide();
    }

    openDemandRemarks(demand) {
        this.demandForRemarks = demand;
        this.getDemandRemarks(demand.DemandId);
    };

    cancelRemarkUpdate(demand): void {
         this.childModalRemarks.hide();
    };

    saveRemark(remarks): void {
        let demand = this.demandForRemarks;
         
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

    openTrail(demand: DemandModelToView): void {
        debugger;
        this.demandTypeName = demand.DemandTypeName;
        this.requesterDepartmentName = demand.RequesterDepartmentName;
        this.getDemandTrails(demand.DemandId);
       

    };

    canceltrail(demand) {
        demand["showTrails"] = false;
    }
    ngOnInit() {
        this.currentIncidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.getMyDemands(this.currentDepartmentId, this.currentIncidentId);
        this.Remarks = "";
        this.globalState.Subscribe('incidentChange', (model) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model) => this.departmentChangeHandler(model));

    };

    private incidentChangeHandler(incidentId): void {
        this.currentIncidentId = incidentId;
        this.getMyDemands(this.currentDepartmentId, this.currentIncidentId);
    };

    private departmentChangeHandler(departmentId): void {
        this.currentDepartmentId = departmentId;
        this.getMyDemands(this.currentDepartmentId, this.currentIncidentId);
    };

    ngAfterContentInit(): any {
        this.setRagStatus();
    };

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }

}