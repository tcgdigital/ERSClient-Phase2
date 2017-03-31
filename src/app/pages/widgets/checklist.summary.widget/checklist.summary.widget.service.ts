import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ActionableModel, ActionableService } from '../../shared.components/actionables';
import { CheckListSummeryModel } from './checklist.summary.widget.model';
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

    /**
     * Creates an instance of ChecklistSummaryWidgetService.
     * @param {DataServiceFactory} dataServiceFactory 
     * @param {ActionableService} actionableService 
     * 
     * @memberOf ChecklistSummaryWidgetService
     */
    constructor(private dataServiceFactory: DataServiceFactory,
        private actionableService: ActionableService) {
        this.checkListSummery = new CheckListSummeryModel();
    }

    GetActionableCount(incidentId: number, departmentId: number): Observable<CheckListSummeryModel> {
        this.checkListSummery = new CheckListSummeryModel();

        return this.actionableService.GetOpenActionableCount(incidentId, departmentId)
            .map((dataOpenActionableCount: number) => {
                this.checkListSummery.openActionableCount = isNaN(dataOpenActionableCount) ? 0 : dataOpenActionableCount;
                return this.checkListSummery;
            })
            .flatMap((checkListSummery: CheckListSummeryModel) => this.actionableService.GetCloseActionableCount(incidentId, departmentId))
            .map((dataOpenActionableCount: number) => {
                this.checkListSummery.closeActionableCount = isNaN(dataOpenActionableCount) ? 0 : dataOpenActionableCount;
                return this.checkListSummery;
            });
    }
}