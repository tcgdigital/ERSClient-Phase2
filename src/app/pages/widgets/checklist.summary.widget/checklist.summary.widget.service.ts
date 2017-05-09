import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ActionableModel, ActionableService } from '../../shared.components/actionables';
import { CheckListSummeryModel } from './checklist.summary.widget.model';
import { DepartmentModel, DepartmentService } from '../../masterdata/department';
import {
    IServiceInretface,
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService,
    ServiceBase

} from '../../../shared';

@Injectable()
export class ChecklistSummaryWidgetService {
    checkListSummery: CheckListSummeryModel;
    public activeDepartments: DepartmentModel[];
    /**
     * Creates an instance of ChecklistSummaryWidgetService.
     * @param {DataServiceFactory} dataServiceFactory 
     * @param {ActionableService} actionableService 
     * 
     * @memberOf ChecklistSummaryWidgetService
     */
    constructor(private dataServiceFactory: DataServiceFactory,
        private actionableService: ActionableService,
        private departmentService: DepartmentService) {
        this.checkListSummery = new CheckListSummeryModel();
    }

    GetActionableCount(incidentId: number, departmentId: number): Observable<CheckListSummeryModel> {
        this.checkListSummery = new CheckListSummeryModel();

        return this.actionableService.GetAssignActionableCount(incidentId, departmentId)
            .map((dataAssignActionableCount: number) => {
                this.checkListSummery.assignActionableCount = isNaN(dataAssignActionableCount) ? 0 : dataAssignActionableCount;
                return this.checkListSummery;
            })
            .flatMap((checkListSummery: CheckListSummeryModel) => this.actionableService.GetCloseActionableCount(incidentId, departmentId))
            .map((dataOpenActionableCount: number) => {
                this.checkListSummery.closeActionableCount = isNaN(dataOpenActionableCount) ? 0 : dataOpenActionableCount;
                return this.checkListSummery;
            });
    }

    GetAllDepartmentChecklists(incidentId: number): Observable<ResponseModel<ActionableModel>> {
        return this.actionableService.GetAllByIncident(incidentId);
    }

    GetAllSubDepartmentChecklists(incidentId: number, departmentId: number): Observable<ResponseModel<ActionableModel>> {
        return this.actionableService.GetAllByIncidentandSubDepartment(incidentId,departmentId);
    }

}