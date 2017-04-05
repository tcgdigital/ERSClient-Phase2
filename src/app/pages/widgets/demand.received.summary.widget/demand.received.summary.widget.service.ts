import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DemandModel, DemandService } from '../../shared.components/demand';
import { DemandReceivedSummeryModel } from './demand.received.summary.widget.model';
import { DepartmentAccessOwnerModel} from '../../shared.components/departmentaccessowner';

import {
    IServiceInretface,
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService,
    ServiceBase
} from '../../../shared';

@Injectable()
export class DemandReceivedSummaryWidgetService {
    public demandReceivedSummery: DemandReceivedSummeryModel;
    public departmentAccessOwnerModels: DepartmentAccessOwnerModel[];
    constructor(private dataServiceFactory: DataServiceFactory,
        private demandService: DemandService) {
        this.demandReceivedSummery = new DemandReceivedSummeryModel();
    }


    GetDemandReceivedCount(incidentId: number, departmentId: number): DemandReceivedSummeryModel {
        let demandsByTargetDeptartment: DemandModel[];
        let departmentIdProjection: string = '';
        let departmentIds: number[]=[];

        this.demandService.GetDepartmentIdProjection(departmentId)
        .subscribe((result) => {
                this.departmentAccessOwnerModels = result.Records;
                this.departmentAccessOwnerModels.forEach((item, index) => {
                    departmentIds.push(item.DepartmentDependentId);
                });
                departmentIds.forEach((item, index) => {
                    if (departmentIds.length > 1) {
                        if (index == 0) {
                            departmentIdProjection = `(TargetDepartmentId eq ${item})`;
                        }
                        else {
                            departmentIdProjection = departmentIdProjection +
                                ` or (TargetDepartmentId eq ${item})`;
                        }
                    }
                    else {
                        departmentIdProjection = `TargetDepartmentId eq ${item}`;
                    }
                });

                this.demandService.GetDemandByTargetDepartment(incidentId, departmentIdProjection)
                        .subscribe((result) => {
                            this.demandReceivedSummery.demandAllocatedCount = result.Count;
                            demandsByTargetDeptartment = result.Records;
                            this.demandReceivedSummery.demandCompletedCount = demandsByTargetDeptartment.filter((item) => {
                                return item.IsCompleted === true;
                            }).length;
                        });
            });
            
        return this.demandReceivedSummery;
    }
}

