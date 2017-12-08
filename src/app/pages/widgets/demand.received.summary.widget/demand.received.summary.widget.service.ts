import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DemandModel, DemandService } from '../../shared.components/demand';
import { DepartmentModel, DepartmentService } from '../../masterdata/department';
import { DemandReceivedSummaryModel, DemandReceivedModel, AllDeptDemandReceivedSummary } from './demand.received.summary.widget.model';
import { DepartmentAccessOwnerModel } from '../../shared.components/departmentaccessowner';
import {
    IServiceInretface,
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService,
    ServiceBase
} from '../../../shared';
import { Response } from '@angular/http/src/static_response';

@Injectable()
export class DemandReceivedSummaryWidgetService {
    public demandReceivedSummary: DemandReceivedSummaryModel;
    public departmentAccessOwnerModels: DepartmentAccessOwnerModel[];
    public demandReceivedModelList: DemandReceivedModel[];
    public allDemands: DemandModel[] = [];
    public subDepartments: DepartmentModel[] = [];
    public allDeptDemandReceivedSummaries: AllDeptDemandReceivedSummary[];
    public subDeptDemandReceivedSummaries: AllDeptDemandReceivedSummary[];
    public showAllDeptSubCompleted: boolean;
    public showAllDeptSubPending: boolean;
    public showSubDeptSubCompleted: boolean;
    public showSubDeptSubPending: boolean;

    constructor(private dataServiceFactory: DataServiceFactory,
        private demandService: DemandService,
        private departmentService: DepartmentService) {
        this.demandReceivedSummary = new DemandReceivedSummaryModel();
    }

    GetDemandReceivedCount(incidentId: number, departmentId: number): DemandReceivedSummaryModel {
        let demandsByTargetDeptartment: DemandModel[];
        let departmentFilter: string = '';
        let departmentIds: number[] = [];
        departmentFilter = `(TargetDepartmentId eq ${departmentId})`;
        this.demandService.GetDemandByTargetDepartments(incidentId, departmentFilter)
            .subscribe((result: ResponseModel<DemandModel>) => {
                // Bug Resolved - This is to check that whether the demand data having demand type table data. which have the information of auto approved.
                // If auto approved flag is true then we are directly considering the autoapproved demand count.
                const autoApprovedDemandCount = result.Records
                    .filter((x: DemandModel) => x.DemandType.IsAutoApproved == true).length;
                // Bug Resolved - This is to check that wheter the demand data having demand type table data. Which have the information of auto approved.
                // If auto approved flag is false then we are considering the information of IsApproved flag in the demand table.
                const ApproverBasedDemandCount = result.Records
                    .filter((x: DemandModel) => x.DemandType.IsAutoApproved == false && x.IsApproved == true).length;

                this.demandReceivedSummary.demandAllocatedCount = (autoApprovedDemandCount + ApproverBasedDemandCount);

                demandsByTargetDeptartment = result.Records;
                this.demandReceivedSummary.demandCompletedCount = demandsByTargetDeptartment.filter((item) => {
                    return item.IsCompleted === true;
                }).length;
            });

        return this.demandReceivedSummary;
    }

    GetSubDepartmentDemandByTargetDepartment(incidentId: number, departmentId: number, callback?: ((_: DemandReceivedModel[]) => void)): void {
        let uniqueDepartments: DepartmentModel[] = [];
        this.demandReceivedModelList = [];
        let localDemandList: DemandModel[] = [];
        this.allDemands = [];
        this.subDepartments = [];
        this.demandService.GetDemandByIncident(incidentId)
            .map((result: ResponseModel<DemandModel>) => {
                result.Records.forEach((itemDemand: DemandModel) => {
                    this.allDemands.push(itemDemand);
                });
            })
            .flatMap((x) => this.departmentService.GetAllActiveSubDepartments(departmentId))
            .map((x: ResponseModel<DepartmentModel>) => {
                x.Records.forEach((childDepartment: DepartmentModel) => {
                    this.subDepartments.push(childDepartment);
                });
            })
            .subscribe((x) => {
                if (this.subDepartments.length == 0) {
                    callback(this.demandReceivedModelList);
                }
                else {

                    this.subDepartments.forEach((itemDepartment: DepartmentModel) => {
                        let demandReceivedModel: DemandReceivedModel = new DemandReceivedModel();
                        let demandModels = this.allDemands.filter((item: DemandModel) => {
                            return item.TargetDepartmentId == itemDepartment.DepartmentId;
                        });
                        if (demandModels.length > 0 && (itemDepartment.ParentDepartmentId || 0) === departmentId) {
                            demandReceivedModel.demandModelList = demandModels;
                            demandReceivedModel.departmentId = itemDepartment.DepartmentId;
                            demandReceivedModel.targetDepartmentName = itemDepartment.DepartmentName;

                            //Get cout of assigned demand
                            const autoApprovedDemandsAssignedCount: number = demandModels
                            .filter((item: DemandModel) => item.DemandType.IsAutoApproved == true).length;
                            const approverBasedDemandsAssignedCount: number = demandModels
                            .filter((item: DemandModel) => item.DemandType.IsAutoApproved == false && item.IsApproved == true).length;
                            demandReceivedModel.assigned = (autoApprovedDemandsAssignedCount + approverBasedDemandsAssignedCount);

                            //Get cout of completed demand
                            const demandsCompletedCount: number = demandModels
                            .filter((item: DemandModel) => { return item.IsClosed == true; }).length;
                            demandReceivedModel.completed = demandsCompletedCount;

                            //Get cout of pending demand
                            const autoApprovedDemandsPendingCount: number = demandModels
                            .filter((item: DemandModel) => item.DemandType.IsAutoApproved == true && item.IsClosed == false).length;
                            const approverBasedDemandsPendingCount: number = demandModels
                            .filter((item: DemandModel) => item.DemandType.IsAutoApproved == false
                                && item.IsApproved == true && item.IsClosed == false).length;
                            demandReceivedModel.pending = (autoApprovedDemandsPendingCount + approverBasedDemandsPendingCount);


                            // demandReceivedModel.assigned = demandModels.length;
                            // let demandModelsCompletedLocal: DemandModel[] = demandModels.filter((item: DemandModel) => { return item.IsClosed == true; });
                            // demandReceivedModel.completed = demandModelsCompletedLocal.length;
                            // let demandModelsPendingLocal: DemandModel[] = demandModels.filter((item: DemandModel) => { return item.IsClosed == false; });
                            // demandReceivedModel.pending = demandModelsPendingLocal.length;
                            this.demandReceivedModelList.push(demandReceivedModel);
                        }

                    });
                    callback(this.demandReceivedModelList);
                }
            });
    }

    GetAllDepartmentDemandByIncident(incidentId: number, callback?: ((_: DemandReceivedModel[]) => void)): void {
        this.demandReceivedModelList = [];
        let uniqueDepartments: DepartmentModel[] = [];
        this.demandService.GetDemandByIncident(incidentId)
            .subscribe((result: ResponseModel<DemandModel>) => {
                result.Records.forEach((itemDemand: DemandModel) => {
                    let department = uniqueDepartments.find(x => x.DepartmentId == itemDemand.TargetDepartmentId);
                    if (department == null) {
                        uniqueDepartments.push(itemDemand.TargetDepartment);
                    }
                });
                uniqueDepartments.forEach((itemDepartment: DepartmentModel) => {
                    let demandReceivedModel: DemandReceivedModel = new DemandReceivedModel();

                    let demandModels = result.Records.filter((item: DemandModel) => {
                        return item.TargetDepartmentId == itemDepartment.DepartmentId;
                    });
                    if (demandModels.length > 0) {
                        demandReceivedModel.demandModelList = demandModels;
                        demandReceivedModel.departmentId = itemDepartment.DepartmentId;
                        demandReceivedModel.targetDepartmentName = itemDepartment.DepartmentName;

                        //Get cout of assigned demand
                        const autoApprovedDemandsAssignedCount: number = demandModels
                            .filter((item: DemandModel) => item.DemandType.IsAutoApproved == true).length;
                        const approverBasedDemandsAssignedCount: number = demandModels
                            .filter((item: DemandModel) => item.DemandType.IsAutoApproved == false && item.IsApproved == true).length;
                        demandReceivedModel.assigned = (autoApprovedDemandsAssignedCount + approverBasedDemandsAssignedCount);

                        //Get cout of completed demand
                        const demandsCompletedCount: number = demandModels
                            .filter((item: DemandModel) => { return item.IsClosed == true; }).length;
                        demandReceivedModel.completed = demandsCompletedCount;

                        //Get cout of pending demand
                        const autoApprovedDemandsPendingCount: number = demandModels
                            .filter((item: DemandModel) => item.DemandType.IsAutoApproved == true && item.IsClosed == false).length;
                        const approverBasedDemandsPendingCount: number = demandModels
                            .filter((item: DemandModel) => item.DemandType.IsAutoApproved == false
                                && item.IsApproved == true && item.IsClosed == false).length;
                        demandReceivedModel.pending = (autoApprovedDemandsPendingCount + approverBasedDemandsPendingCount);

                        this.demandReceivedModelList.push(demandReceivedModel);
                    }
                });
                callback(this.demandReceivedModelList);
            });
    }

    public showAllDeptSubCompletedFunc(demandModelList: DemandModel[]): void {
        this.allDeptDemandReceivedSummaries = [];
        demandModelList.forEach((item: DemandModel) => {
            if (item.IsClosed == true) {
                let allDeptDemandReceivedSummary: AllDeptDemandReceivedSummary = new AllDeptDemandReceivedSummary();
                allDeptDemandReceivedSummary.description = item.DemandDesc;
                allDeptDemandReceivedSummary.requesterDepartmentName = item.TargetDepartment.DepartmentName;
                let ScheduleTime: number = (Number(item.ScheduleTime) * 60000);
                let CreatedOn: number = new Date(item.CreatedOn).getTime();
                allDeptDemandReceivedSummary.scheduleCloseTime = new Date(CreatedOn + ScheduleTime);
                allDeptDemandReceivedSummary.ScheduleTime = item.ScheduleTime;
                allDeptDemandReceivedSummary.CreatedOn = item.CreatedOn;
                this.allDeptDemandReceivedSummaries.push(allDeptDemandReceivedSummary);
            }

        });
        Observable.interval(1000).subscribe(_ => {
            this.allDeptDemandReceivedSummaries.forEach((dept: AllDeptDemandReceivedSummary) => {
                let ScheduleTime: number = (Number(dept.ScheduleTime) * 60000);
                let CreatedOn: number = new Date(dept.CreatedOn).getTime();
                let CurrentTime: number = new Date().getTime();
                let TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
                let percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));
                if (percentage < 50) {
                    dept.RagStatus = 'statusGreen';
                } else if (percentage >= 100) {
                    dept.RagStatus = 'statusRed';
                }
                else {
                    dept.RagStatus = 'statusAmber';
                }
            });
        });
        this.showAllDeptSubCompleted = true;
        this.showAllDeptSubPending = false;
    }

    public hideAllDeptSubCompleted(): void {
        this.showAllDeptSubCompleted = false;
        this.showAllDeptSubPending = false;

    }

    public showAllDeptSubPendingFunc(demandModelList: DemandModel[]): void {
        this.allDeptDemandReceivedSummaries = [];
        demandModelList.forEach((item: DemandModel) => {
            if (item.IsClosed == false) {
                let allDeptDemandReceivedSummary: AllDeptDemandReceivedSummary = new AllDeptDemandReceivedSummary();
                allDeptDemandReceivedSummary.description = item.DemandDesc;
                allDeptDemandReceivedSummary.requesterDepartmentName = item.TargetDepartment.DepartmentName;
                let ScheduleTime: number = (Number(item.ScheduleTime) * 60000);
                let CreatedOn: number = new Date(item.CreatedOn).getTime();
                allDeptDemandReceivedSummary.scheduleCloseTime = new Date(CreatedOn + ScheduleTime);
                allDeptDemandReceivedSummary.ScheduleTime = item.ScheduleTime;
                allDeptDemandReceivedSummary.CreatedOn = item.CreatedOn;
                this.allDeptDemandReceivedSummaries.push(allDeptDemandReceivedSummary);
            }
        });

        Observable.interval(1000).subscribe(_ => {
            this.allDeptDemandReceivedSummaries.forEach((dept: AllDeptDemandReceivedSummary) => {
                let ScheduleTime: number = (Number(dept.ScheduleTime) * 60000);
                let CreatedOn: number = new Date(dept.CreatedOn).getTime();
                let CurrentTime: number = new Date().getTime();
                let TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
                let percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));
                if (percentage < 50) {
                    dept.RagStatus = 'statusGreen';
                } else if (percentage >= 100) {
                    dept.RagStatus = 'statusRed';
                }
                else {
                    dept.RagStatus = 'statusAmber';
                }
            });
        });

        this.showAllDeptSubPending = true;
        this.showAllDeptSubCompleted = false;
    }

    public hideAllDeptSubPending(): void {
        this.showAllDeptSubPending = false;
        this.showAllDeptSubCompleted = false;
    }


}

