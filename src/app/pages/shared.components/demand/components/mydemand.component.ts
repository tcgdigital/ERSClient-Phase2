import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';


import { InvolvePartyModel } from '../../../shared.components';
import { DemandModel, DemandModelToView } from './demand.model';
import { DemandService } from './demand.service';
import { ResponseModel, DataExchangeService, GlobalConstants } from '../../../../shared';

@Component({
    selector: 'my-demand',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/mydemand.view.html'
})
export class MyDemandComponent implements OnInit {

    constructor(private demandService: DemandService,private dataExchange: DataExchangeService<number>) { }
    mydemands: DemandModelToView[];
    currentDepartment: number;
    currentIncident: number;

    getMyDemands(deptId, incidentId): void {
        this.demandService.GetByRequesterDepartment(deptId, incidentId)
            .subscribe((response: ResponseModel<DemandModel>) => {
                debugger;
                this.mydemands = this.demandService.DemandMapper(response.Records);
            }, (error: any) => {
                console.log("error:  " + error);
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
        console.log("Event to publish" + demandId);     
         this.dataExchange.Publish("OnDemandUpdate", demandId);
    };

    ngOnInit() {
        
        this.currentDepartment=4;
        this.currentIncident = 1;
        this.getMyDemands(this.currentDepartment,this.currentIncident);

    };
    
    ngAfterContentInit() {
        this.setRagStatus();
    };

}