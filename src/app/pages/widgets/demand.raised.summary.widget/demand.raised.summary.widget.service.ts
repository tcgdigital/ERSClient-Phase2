import { Injectable } from '@angular/core';
import { DemandModel, DemandService } from '../../shared.components/demand';
import { DemandRaisedSummeryModel } from './demand.raised.summary.widget.model';
import { DepartmentAccessOwnerModel } from '../../shared.components/departmentaccessowner';

import {
    IServiceInretface,
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService,
    ServiceBase
} from '../../../shared';

@Injectable()
export class DemandRaisedSummaryWidgetService {
    public demandRaisedSummery: DemandRaisedSummeryModel;
    public departmentAccessOwnerModels: DepartmentAccessOwnerModel[];
    constructor(private dataServiceFactory: DataServiceFactory,
        private demandService: DemandService) {
        this.demandRaisedSummery = new DemandRaisedSummeryModel();
    }



    GetDemandRaisedCount(incidentId: number, departmentId: number): DemandRaisedSummeryModel {
        let demandsByRequesterDeptartment: DemandModel[];
        let departmentIdProjection: string = '';
        let departmentIds: number[] = [];

        this.demandService.GetDepartmentIdProjection(departmentId)
            .subscribe((result) => {
                this.departmentAccessOwnerModels = result.Records;
                this.departmentAccessOwnerModels.forEach((item, index) => {
                    departmentIds.push(item.DepartmentDependentId);
                });
                departmentIds.forEach((item, index) => {
                    if (departmentIds.length > 1) {
                        if (index == 0) {
                            departmentIdProjection = `(RequesterDepartmentId eq ${item})`;
                        }
                        else {
                            departmentIdProjection = departmentIdProjection +
                                ` or (RequesterDepartmentId eq ${item})`;
                        }
                    }
                    else {
                        departmentIdProjection = `RequesterDepartmentId eq ${item}`;
                    }
                });

                this.demandService.GetDemandByRequesterDepartment(incidentId, departmentIdProjection)
                    .subscribe((result) => {
                        this.demandRaisedSummery.demandRaisedCount = result.Count;
                        demandsByRequesterDeptartment = result.Records;
                        this.demandRaisedSummery.demandClosedCount = demandsByRequesterDeptartment.filter((item) => {
                            return item.IsClosed === true;
                        }).length;
                    });
            });

        return this.demandRaisedSummery;
    }
}