import { Injectable } from '@angular/core';
import { DemandModel, DemandService } from '../../shared.components/demand';
import { DemandRaisedSummaryModel, AllDemandRaisedSummaryModel, DemandRaisedModel } from './demand.raised.summary.widget.model';
import { DepartmentAccessOwnerModel } from '../../shared.components/departmentaccessowner';
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
export class DemandRaisedSummaryWidgetService {
    public demandRaisedSummary: DemandRaisedSummaryModel;
    public departmentAccessOwnerModels: DepartmentAccessOwnerModel[];
    public dataTemp: DemandModel[];
    public allocatedDemandDetails: AllDemandRaisedSummaryModel[];
    public allocatedDemandDetail: AllDemandRaisedSummaryModel;
    public demandRaisedModelList: DemandRaisedModel[];
    public allDemands: DemandModel[] = [];
    public subDepartments: DepartmentModel[] = [];
    constructor(private dataServiceFactory: DataServiceFactory,
        private demandService: DemandService,
        private departmentService: DepartmentService) {
        this.demandRaisedSummary = new DemandRaisedSummaryModel();
        this.demandRaisedModelList = [];
    }

    GetDemandRaisedCount(incidentId: number, departmentId: number): DemandRaisedSummaryModel {
        let demandsByRequesterDeptartment: DemandModel[];
        let departmentIdProjection: string = '';
        let departmentIds: number[] = [];

        this.demandService.GetDemandByRequesterDepartment(incidentId, departmentId)
            .subscribe((result) => {
                this.demandRaisedSummary.demandRaisedCount = result.Count;
                demandsByRequesterDeptartment = result.Records;
                this.demandRaisedSummary.demandClosedCount = demandsByRequesterDeptartment.filter((item) => {
                    return item.IsClosed === true;
                }).length;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });

        return this.demandRaisedSummary;
    }

    GetAllDemandByRequesterDepartment(incidentId: number, departmentId: number, callback?: ((_: AllDemandRaisedSummaryModel[]) => void)): void {
        let demandsByTargetDeptartment: DemandModel[];
        let departmentIdProjection: string = '';
        let departmentIds: number[] = [];
        departmentIdProjection = `(RequesterDepartmentId eq ${departmentId})`;

        this.demandService.GetDemandByRequesterDepartments(incidentId, departmentIdProjection)
            .subscribe((result) => {
                this.dataTemp = result.Records.filter((filter) => {
                    return filter.RequesterDepartmentId == departmentId;
                });

                this.allocatedDemandDetail = new AllDemandRaisedSummaryModel();
                this.allocatedDemandDetails = [];
                this.dataTemp.forEach((item: DemandModel) => {
                    this.allocatedDemandDetail = new AllDemandRaisedSummaryModel();
                    this.allocatedDemandDetail = this.FillAllDemandRaisedSummaryObject(this.allocatedDemandDetail, item);
                    this.allocatedDemandDetails.push(this.allocatedDemandDetail);
                });

                this.allocatedDemandDetails.map((demand) => {
                    let minutesInt: number = parseInt(demand.ScheduleTime);
                    let totalMilliSecondsTillCreatedOn: number = new Date(demand.CreatedOn).getTime();
                    let totalMinutesTillCreatedOn: number = totalMilliSecondsTillCreatedOn / 60000;
                    let totalMinutesAfterAddingScheduleTime: number = totalMinutesTillCreatedOn + minutesInt;
                    let totalMilliSecondsAfterAddingScheduleTime: number = totalMinutesAfterAddingScheduleTime * 60000;
                    demand.ScheduledClose = new Date(totalMilliSecondsAfterAddingScheduleTime);
                });

                callback(this.allocatedDemandDetails);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    FillAllDemandRaisedSummaryObject(initialObject: AllDemandRaisedSummaryModel, fillObject: DemandModel): AllDemandRaisedSummaryModel {
        initialObject.DemandId = fillObject.DemandId;
        initialObject.DemandTypeId = fillObject.DemandTypeId;
        initialObject.DemandCode = fillObject.DemandCode;
        initialObject.DemandRefId = fillObject.DemandRefId;
        initialObject.IncidentId = fillObject.IncidentId;
        initialObject.AffectedId = fillObject.AffectedId;
        initialObject.RequesterDepartment = new DepartmentModel();
        initialObject.RequesterDepartment.DepartmentName = fillObject.RequesterDepartment.DepartmentName;
        initialObject.AffectedSituationId = fillObject.AffectedSituationId;
        initialObject.AffectedPersonId = fillObject.AffectedPersonId;
        initialObject.AffectedObjectId = fillObject.AffectedObjectId;
        initialObject.CallerId = fillObject.CallerId;
        initialObject.TargetDepartmentId = fillObject.TargetDepartmentId;
        initialObject.RequesterDepartmentId = fillObject.RequesterDepartmentId;
        initialObject.RequesterParentDepartmentId = fillObject.RequesterParentDepartmentId;
        initialObject.ApproverDepartmentId = fillObject.ApproverDepartmentId;
        initialObject.AWB = fillObject.AWB;
        initialObject.PDATicketNumber = fillObject.PDATicketNumber;
        initialObject.DemandDesc = fillObject.DemandDesc;
        initialObject.IsApproved = fillObject.IsApproved;
        initialObject.ApprovedBy = fillObject.ApprovedBy;
        initialObject.ApprovedDt = fillObject.ApprovedDt;
        initialObject.RequestedBy = fillObject.RequestedBy;
        initialObject.RequesterType = fillObject.RequesterType;
        initialObject.DemandStatusDescription = fillObject.DemandStatusDescription;
        initialObject.ScheduleTime = fillObject.ScheduleTime;
        initialObject.Remarks = fillObject.Remarks;
        initialObject.IsClosed = fillObject.IsClosed;
        initialObject.ClosedBy = fillObject.ClosedBy;
        initialObject.ClosedOn = fillObject.ClosedOn;
        initialObject.CreatedOn = fillObject.CreatedOn;
        initialObject.ScheduledClose = fillObject.ScheduledClose;
        initialObject.ContactNumber = fillObject.ContactNumber;
        initialObject.Priority = fillObject.Priority;
        initialObject.RequiredLocation = fillObject.RequiredLocation;
        initialObject.IsRejected = fillObject.IsRejected;
        initialObject.IsCompleted = fillObject.IsCompleted;
        initialObject.RejectedBy = fillObject.RejectedBy;
        initialObject.RejectedDate = fillObject.RejectedDate;
        initialObject.ClosedByDepartmentId = fillObject.ClosedByDepartmentId;
        return initialObject;
    }

    GetAllDepartmentDemandByIncident(incidentId: number, callback?: ((_: DemandRaisedModel[]) => void)): void {
        this.demandRaisedModelList = [];
        let uniqueDepartments: DepartmentModel[] = [];

        this.demandService.GetDemandByIncident(incidentId)
            .subscribe((result: ResponseModel<DemandModel>) => {
                result.Records.forEach((itemDemand: DemandModel) => {
                    let department = uniqueDepartments.find(x => x.DepartmentId == itemDemand.RequesterDepartmentId);
                    if (department == null) {
                        uniqueDepartments.push(itemDemand.RequesterDepartment);
                    }
                });
                uniqueDepartments.forEach((itemDepartment: DepartmentModel) => {
                    let demandRaisedModel: DemandRaisedModel = new DemandRaisedModel();
                    let demandModels = result.Records.filter((item: DemandModel) => {
                        return item.RequesterDepartmentId == itemDepartment.DepartmentId;
                    });
                    if (demandModels.length > 0) {
                        demandRaisedModel.demandModelList = demandModels;
                        demandRaisedModel.departmentId = itemDepartment.DepartmentId;
                        demandRaisedModel.requesterDepartmentName = itemDepartment.DepartmentName;
                        demandRaisedModel.assigned = demandModels.length;
                        let demandModelsCompletedLocal: DemandModel[] = demandModels.filter((item: DemandModel) => { return item.IsClosed == true; });
                        demandRaisedModel.completed = demandModelsCompletedLocal.length;
                        let demandModelsPendingLocal: DemandModel[] = demandModels.filter((item: DemandModel) => { return item.IsClosed == false; });
                        demandRaisedModel.pending = demandModelsPendingLocal.length;
                        this.demandRaisedModelList.push(demandRaisedModel);
                    }

                });
                callback(this.demandRaisedModelList);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    GetSubDepartmentDemandByRaisedDepartment(incidentId: number, departmentId: number, callback?: ((_: DemandRaisedModel[]) => void)): void {
        let uniqueDepartments: DepartmentModel[] = [];
        this.demandRaisedModelList = [];
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
                    callback(this.demandRaisedModelList);
                }
                else {
                    this.subDepartments.forEach((itemDepartment: DepartmentModel) => {
                        let demandRaisedModel: DemandRaisedModel = new DemandRaisedModel();
                        let demandModels = this.allDemands.filter((item: DemandModel) => {
                            return item.RequesterDepartmentId == itemDepartment.DepartmentId;
                        });
                        if (demandModels.length > 0) {
                            demandRaisedModel.demandModelList = demandModels;
                            demandRaisedModel.departmentId = itemDepartment.DepartmentId;
                            demandRaisedModel.requesterDepartmentName = itemDepartment.DepartmentName;
                            demandRaisedModel.assigned = demandModels.length;
                            let demandModelsCompletedLocal: DemandModel[] = demandModels.filter((item: DemandModel) => { return item.IsClosed == true; });
                            demandRaisedModel.completed = demandModelsCompletedLocal.length;
                            let demandModelsPendingLocal: DemandModel[] = demandModels.filter((item: DemandModel) => { return item.IsClosed == false; });
                            demandRaisedModel.pending = demandModelsPendingLocal.length;
                            this.demandRaisedModelList.push(demandRaisedModel);
                        }

                    });
                    callback(this.demandRaisedModelList);
                }

            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }
}