import {
    Component, OnInit, ViewEncapsulation,
    Input, ViewChild, OnDestroy, SimpleChange, AfterViewInit
} from '@angular/core';
import { CheckListSummeryModel, DeptCheckListModel, SubDeptCheckListModel } from './checklist.summary.widget.model';
import { ChecklistSummaryWidgetService } from './checklist.summary.widget.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs/Rx';
import { ChecklistTrailModel, ChecklistTrailService } from '../../shared.components/checklist.trail';
import { ActionableModel } from '../../shared.components/actionables/components/actionable.model';
import { ResponseModel, GlobalStateService, KeyValue, GlobalConstants } from '../../../shared';
import { DepartmentModel } from '../../masterdata/department/components/department.model';
import * as Highcharts from 'highcharts';
import { WidgetUtilityService } from '../widget.utility';
import { IncidentModel, IncidentService } from '../../incident';
import {
    GraphObject
} from '../demand.raised.summary.widget/demand.raised.summary.widget.model';
import { ActionableStatusLogModel,ActionableStatusLogService } from "../../shared.components/actionablestatuslog";

@Component({
    selector: 'checklist-summary-widget',
    templateUrl: './checklist.summary.widget.view.html',
    styleUrls: ['./checklist.summary.widget.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ChecklistSummaryWidgetComponent implements OnInit, OnDestroy {
    @Input('initiatedDepartmentId') initiatedDepartmentId: number;
    @Input('currentIncidentId') incidentId: number;

    @ViewChild('childModalViewAllChecklist') public childModalViewAllChecklist: ModalDirective;
    @ViewChild('childModalViewSubDeptChecklist') public childModalViewSubDeptChecklist: ModalDirective;

    public checkListSummery: CheckListSummeryModel;
    public deptCheckListsAll: Observable<DeptCheckListModel[]>;
    public deptCheckListsSubDept: Observable<DeptCheckListModel[]>;
    public showAllDeptSubChecklistCompleted: boolean;
    public showAllDeptSubChecklistPending: boolean;
    public showSubDeptSubChecklistCompleted: boolean;
    public showSubDeptSubChecklistPending: boolean;
    public subDeptCompletedCheckLists: Observable<SubDeptCheckListModel[]>;
    public subDeptPendingCheckLists: SubDeptCheckListModel[];
    public subdeptChecklistsLoc: ActionableModel[];
    public arrGraphData: GraphObject[];
    public currentTarget: any;
    public showCheckListGraph: boolean = false;
    public isShow: boolean = true;
    public isShowViewAll: boolean = true;
    public isShowViewSub: boolean = true;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;
    public baseLocationURl: string = window.location.pathname;
    public showGraph: boolean = false;
    currentDepartmentId: number;
    currentIncidentId: number;

    /**
     * Creates an instance of ChecklistSummaryWidgetComponent.
     * @param {ChecklistSummaryWidgetService} checklistSummaryWidgetService
     *
     * @memberOf ChecklistSummaryWidgetComponent
     */
    constructor(private checklistSummaryWidgetService: ChecklistSummaryWidgetService,
        private globalState: GlobalStateService, private incidentService: IncidentService,
        private checklistTrailService: ChecklistTrailService,
        private actionableStatusLogService: ActionableStatusLogService) { }

    public ngOnInit(): void {
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.initiatedDepartmentId;
        this.getActionableCount(this.currentIncidentId, this.currentDepartmentId);
        this.showGraph = false;
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));
        this.globalState.Subscribe('checkListStatusChange', () => this.checkListStatusChangeHandler());
        this.showAllDeptSubChecklistCompleted = false;
        this.showAllDeptSubChecklistPending = false;

        // SignalR Notification
        this.globalState.Subscribe('ReceiveChecklistStatusChangeResponse', (model: ActionableModel) => {
            this.getActionableCount(model.IncidentId, model.DepartmentId);
        });
        this.globalState.Subscribe('ReceiveChecklistCreationResponse', (count: number) => {
            if (count > 0)
                this.getActionableCount(this.currentIncidentId, this.currentDepartmentId);
        });
    }

    public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        this.showGraph = false;
        if (changes['departmentId'] !== undefined && (changes['departmentId'].currentValue !==
            changes['departmentId'].previousValue) &&
            changes['departmentId'].previousValue !== undefined) {
            this.currentDepartmentId = changes['departmentId'].currentValue;
            this.getActionableCount(this.currentIncidentId, this.currentDepartmentId);
        }
    }

    getActionableCount(incidentId, departmentId): void {
        this.checkListSummery = new CheckListSummeryModel();
        this.checklistSummaryWidgetService.GetActionableCount(incidentId, departmentId)
            .subscribe((checkListSummeryObservable) => {
                this.checkListSummery = checkListSummeryObservable;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    public ViewAllChecklist(callback?: () => void): void {
        let deptCheckListsLocal: DeptCheckListModel[] = [];
        const data: ActionableModel[] = [];
        const uniqueDepartments: DepartmentModel[] = [];
        this.checklistSummaryWidgetService.GetAllDepartmentChecklists(this.incidentId)
            .subscribe((result: ResponseModel<ActionableModel>) => {
                result.Records.forEach((record) => {
                    data.push(record);
                });

            }, (error: any) => {
                console.log(`Error: ${error}`);
            }, () => {
                // Getting unique departments from the acctionable>checklist>target department.
                data.forEach((itemActionable: ActionableModel) => {
                    const department = uniqueDepartments.find((x) => x.DepartmentId === itemActionable.CheckList.DepartmentId);
                    if (department == null) {
                        uniqueDepartments.push(itemActionable.CheckList.TargetDepartment);
                    }
                });
                uniqueDepartments.forEach((itemDepartment: DepartmentModel) => {
                    const actionableListOfSameDepartment = data.filter((itemActionable: ActionableModel) => {
                        return itemActionable.CheckList.DepartmentId === itemDepartment.DepartmentId;
                    });

                    let depCM: DeptCheckListModel;
                    depCM = new DeptCheckListModel();
                    depCM.actionableModelList = actionableListOfSameDepartment;
                    depCM.departmentId = itemDepartment.DepartmentId;
                    depCM.departmentName = itemDepartment.DepartmentName;
                    depCM.assigned = actionableListOfSameDepartment.length;
                    depCM.pending = actionableListOfSameDepartment.filter((item: ActionableModel) => {
                        return item.CompletionStatus !== 'Closed';
                    }).length;

                    depCM.completed = actionableListOfSameDepartment.filter((item: ActionableModel) => {
                        return item.CompletionStatus === 'Closed';
                    }).length;
                    deptCheckListsLocal.push(depCM);
                });
                deptCheckListsLocal = deptCheckListsLocal.sort(function (a, b) { return (a.departmentName.toUpperCase() > b.departmentName.toUpperCase()) ? 1 : ((b.departmentName.toUpperCase() > a.departmentName.toUpperCase()) ? -1 : 0); });
                this.deptCheckListsAll = Observable.of(deptCheckListsLocal);
                this.showGraph = false;
                if (deptCheckListsLocal.length > 0) {
                    const departmentLocal: DepartmentModel = new DepartmentModel();
                    departmentLocal.DepartmentId = deptCheckListsLocal[0].departmentId;
                    departmentLocal.DepartmentName = deptCheckListsLocal[0].departmentName;
                    this.graphDataFormationForChecklistWidget(departmentLocal.DepartmentId, null);
                }
                if (callback) {
                    callback();
                }
            });
    }

    public ViewSubDeptChecklist(callback?: () => void): void {
        let deptCheckListsLocal: DeptCheckListModel[] = [];
        const data: ActionableModel[] = [];
        const uniqueDepartments: DepartmentModel[] = [];
        this.checklistSummaryWidgetService.GetAllSubDepartmentChecklists(this.incidentId, this.initiatedDepartmentId)
            .subscribe((result: ResponseModel<ActionableModel>) => {
                result.Records.forEach((record) => {
                    data.push(record);
                });

            }, (error: any) => {
                console.log(`Error: ${error}`);
            }, () => {
                // Getting unique departments from the acctionable>checklist>target department.
                data.forEach((itemActionable: ActionableModel) => {
                    const department = uniqueDepartments.find((x) => x.DepartmentId === itemActionable.CheckList.DepartmentId);
                    if (department == null) {
                        uniqueDepartments.push(itemActionable.CheckList.TargetDepartment);
                    }
                });
                uniqueDepartments.forEach((itemDepartment: DepartmentModel) => {
                    const actionableListOfSameDepartment = data.filter((itemActionable: ActionableModel) => {
                        return itemActionable.CheckList.DepartmentId === itemDepartment.DepartmentId;
                    });
                    let depCM: DeptCheckListModel;
                    depCM = new DeptCheckListModel();
                    depCM.actionableModelList = actionableListOfSameDepartment;
                    depCM.departmentId = itemDepartment.DepartmentId;
                    depCM.departmentName = itemDepartment.DepartmentName;
                    depCM.assigned = actionableListOfSameDepartment.length;
                    depCM.pending = actionableListOfSameDepartment.filter((item: ActionableModel) => {
                        return item.CompletionStatus !== 'Closed';
                    }).length;

                    depCM.completed = actionableListOfSameDepartment.filter((item: ActionableModel) => {
                        return item.CompletionStatus === 'Closed';
                    }).length;
                    deptCheckListsLocal.push(depCM);
                });
                deptCheckListsLocal = deptCheckListsLocal.sort(function (a, b) { return (a.departmentName.toUpperCase() > b.departmentName.toUpperCase()) ? 1 : ((b.departmentName.toUpperCase() > a.departmentName.toUpperCase()) ? -1 : 0); });
                this.deptCheckListsSubDept = Observable.of(deptCheckListsLocal);
                if (callback) {
                    callback();
                }
            });
    }

    public openViewAllChecklist(): void {
        this.ViewAllChecklist(() => {
            this.childModalViewAllChecklist.show();
        });
    }

    public graphDataFormationForChecklistWidget(departmentId: number, $event: any): void {
        this.currentTarget = null;
        if ($event) {
            this.currentTarget = $event.currentTarget;
        }

        this.checklistTrailService.GetChecklistTrailByDepartmentIdandIncidentId(departmentId, this.currentIncidentId)
            .subscribe((resultSet: ResponseModel<ChecklistTrailModel>) => {
                this.showGraph = true;
                this.GetChecklistGraph(resultSet.Records, this.currentTarget);
            });
    }

    public GetChecklistGraph(resultSet: ChecklistTrailModel[], currentTarget: any) {
        if (currentTarget !== null) {
            const $currentRow: JQuery = jQuery(currentTarget);
            $currentRow.closest('tbody').find('tr').removeClass('bg-blue-color');
            $currentRow.closest('tr').addClass('bg-blue-color');
        }
        const requesterDepartmentId: number = resultSet[0].DepartmentId;
        
        this.actionableStatusLogService.GetAllByIncidentDepartment(this.incidentId,requesterDepartmentId)
        .subscribe((actionableStatusLogModels:ResponseModel<ActionableStatusLogModel>)=>{
            this.incidentService.GetIncidentById(this.incidentId)
            .subscribe((incidentModel: IncidentModel) => {
                WidgetUtilityService.GetGraphCheckList(requesterDepartmentId, Highcharts, actionableStatusLogModels.Records,
                    'checklist-graph-container', 'Status', incidentModel.CreatedOn,resultSet[0].Department.DepartmentName);
                this.showCheckListGraph = true;
            });
        });
        
    }

    public onViewAllCheckListShown($event: ModalDirective): void {
        jQuery('#checklist-table tbody tr:nth-child(1)').addClass('bg-blue-color');
    }

    public hideViewAllChecklist(): void {
        this.showAllDeptSubChecklistCompleted = false;
        this.showAllDeptSubChecklistPending = false;
        this.childModalViewAllChecklist.hide();
    }

    public openViewSubDeptChecklist(): void {
        this.ViewSubDeptChecklist(() => {
            this.showSubDeptSubChecklistPending = false;
            this.showSubDeptSubChecklistCompleted = false;
            this.childModalViewSubDeptChecklist.show();
        });
    }

    public hideViewSubDeptChecklist(): void {
        this.showSubDeptSubChecklistPending = false;
        this.showSubDeptSubChecklistCompleted = false;
        this.childModalViewSubDeptChecklist.hide();
    }

    public showAllDeptSubTableCompleted(deptCheckListModel: DeptCheckListModel): void {
        this.showAllDeptSubChecklistCompleted = false;
        this.showAllDeptSubChecklistPending = false;
        const subdeptChecklists: SubDeptCheckListModel[] = [];
        const completionStatusActionables = deptCheckListModel.actionableModelList.filter((item: ActionableModel) => {
            return item.CompletionStatus === 'Closed';
        });

        completionStatusActionables.forEach((item: ActionableModel) => {
            const subdeptChecklist: SubDeptCheckListModel = new SubDeptCheckListModel();
            subdeptChecklist.checkListDesc = item.CheckListDetails;
            subdeptChecklist.scheduleCloseTime = item.ScheduleClose;
            subdeptChecklist.RAG = this.setAllDeptRagStatusForCompleted(item);
            subdeptChecklists.push(subdeptChecklist);
        });
        this.subDeptCompletedCheckLists = Observable.of(subdeptChecklists);

        this.showAllDeptSubChecklistCompleted = true;
    }

    public showAllDeptSubTablePending(deptCheckListModel: DeptCheckListModel): void {
        this.showAllDeptSubChecklistCompleted = false;
        this.showAllDeptSubChecklistPending = false;
        const subdeptChecklists: SubDeptCheckListModel[] = [];
        const completionStatusActionables = deptCheckListModel.actionableModelList.filter((item: ActionableModel) => {
            return item.CompletionStatus != 'Closed';
        });
        this.setAllDeptRagStatusForPending(completionStatusActionables);
        this.showAllDeptSubChecklistPending = true;
    }

    public hideAllDeptSubTableCompleted(): void {
        this.showAllDeptSubChecklistCompleted = false;
        this.showAllDeptSubChecklistPending = false;
    }

    public hideAllDeptSubTablePending(): void {
        this.showAllDeptSubChecklistCompleted = false;
        this.showAllDeptSubChecklistPending = false;
    }

    public setAllDeptRagStatusForCompleted(itemActionable: ActionableModel): string {
        const CreatedOn: number = new Date(itemActionable.AssignedDt).getTime();
        const ScheduleTime: number = (Number(itemActionable.Duration) * 60000);
        const CurrentTime: number = new Date(itemActionable.CompletionStatusChangedOn).getTime();
        const TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
        const percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));
        if (percentage < 50) {
            return 'statusGreen';
        } else if (percentage >= 100) {
            return 'statusRed';
        }
        else {
            return 'statusAmber';
        }
    }

    public setAllDeptRagStatusForPending(Actionables: ActionableModel[]): void {
        const subdeptChecklists: SubDeptCheckListModel[] = [];
        this.subDeptPendingCheckLists = [];
        Actionables.forEach((itemActionable: ActionableModel) => {
            const subdeptChecklist: SubDeptCheckListModel = new SubDeptCheckListModel();
            subdeptChecklist.checkListDesc = itemActionable.CheckListDetails;
            subdeptChecklist.scheduleCloseTime = itemActionable.ScheduleClose;
            subdeptChecklist.AssignedDt = itemActionable.AssignedDt;
            subdeptChecklist.Duration = itemActionable.Duration;
            subdeptChecklists.push(subdeptChecklist);
        });
        this.subDeptPendingCheckLists = subdeptChecklists;
        Observable.interval(1000).subscribe((_) => {

            this.subDeptPendingCheckLists.forEach((itemSubDeptCheckListModel: SubDeptCheckListModel) => {
                const CreatedOn: number = new Date(itemSubDeptCheckListModel.AssignedDt).getTime();
                const ScheduleTime: number = (Number(itemSubDeptCheckListModel.Duration) * 60000);
                const CurrentTime: number = new Date().getTime();
                const TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
                const percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));
                if (percentage < 50) {
                    itemSubDeptCheckListModel.RAG = 'statusGreen';
                } else if (percentage >= 100) {
                    itemSubDeptCheckListModel.RAG = 'statusRed';
                }
                else {
                    itemSubDeptCheckListModel.RAG = 'statusAmber';
                }
            });
        });
    }

    public showSubDeptSubTableCompleted(deptCheckListModel: DeptCheckListModel): void {
        this.showSubDeptSubChecklistCompleted = false;
        this.showSubDeptSubChecklistPending = false;
        const subdeptChecklists: SubDeptCheckListModel[] = [];
        const completionStatusActionables = deptCheckListModel.actionableModelList.filter((item: ActionableModel) => {
            return item.CompletionStatus === 'Closed';
        });

        completionStatusActionables.forEach((item: ActionableModel) => {
            const subdeptChecklist: SubDeptCheckListModel = new SubDeptCheckListModel();
            subdeptChecklist.checkListDesc = item.CheckListDetails;
            subdeptChecklist.scheduleCloseTime = item.ScheduleClose;
            subdeptChecklist.RAG = this.setSubDeptRagStatusForCompleted(item);
            subdeptChecklists.push(subdeptChecklist);
        });
        this.subDeptCompletedCheckLists = Observable.of(subdeptChecklists);

        this.showSubDeptSubChecklistCompleted = true;
    }

    public showSubDeptSubTablePending(deptCheckListModel: DeptCheckListModel): void {
        this.showSubDeptSubChecklistCompleted = false;
        this.showSubDeptSubChecklistPending = false;
        const subdeptChecklists: SubDeptCheckListModel[] = [];
        const completionStatusActionables = deptCheckListModel.actionableModelList.filter((item: ActionableModel) => {
            return item.CompletionStatus !== 'Closed';
        });
        this.setSubDeptRagStatusForPending(completionStatusActionables);
        this.showSubDeptSubChecklistPending = true;
    }

    public hideSubDeptSubTableCompleted(): void {
        this.showSubDeptSubChecklistCompleted = false;
        this.showSubDeptSubChecklistPending = false;
    }

    public hideSubDeptSubTablePending(): void {
        this.showSubDeptSubChecklistCompleted = false;
        this.showSubDeptSubChecklistPending = false;
    }

    public setSubDeptRagStatusForCompleted(itemActionable: ActionableModel): string {
        const CreatedOn: number = new Date(itemActionable.AssignedDt).getTime();
        const ScheduleTime: number = (Number(itemActionable.Duration) * 60000);
        const CurrentTime: number = new Date(itemActionable.CompletionStatusChangedOn).getTime();
        const TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
        const percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));
        if (percentage < 50) {
            return 'statusGreen';
        } else if (percentage >= 100) {
            return 'statusRed';
        }
        else {
            return 'statusAmber';
        }
    }

    public setSubDeptRagStatusForPending(Actionables: ActionableModel[]): void {
        this.subDeptPendingCheckLists = [];
        let subdeptChecklists: SubDeptCheckListModel[] = [];
        Actionables.forEach((itemActionable: ActionableModel) => {
            const subdeptChecklist: SubDeptCheckListModel = new SubDeptCheckListModel();
            subdeptChecklist.checkListDesc = itemActionable.CheckListDetails;
            subdeptChecklist.scheduleCloseTime = itemActionable.ScheduleClose;
            subdeptChecklist.AssignedDt = itemActionable.AssignedDt;
            subdeptChecklist.Duration = itemActionable.Duration;
            subdeptChecklists.push(subdeptChecklist);
        });
        this.subDeptPendingCheckLists = subdeptChecklists;
        Observable.interval(1000).subscribe((_) => {
            subdeptChecklists = [];
            this.subDeptPendingCheckLists.forEach((itemSubDeptCheckListModel: SubDeptCheckListModel) => {

                const CreatedOn: number = new Date(itemSubDeptCheckListModel.AssignedDt).getTime();
                const ScheduleTime: number = (Number(itemSubDeptCheckListModel.Duration) * 60000);
                const CurrentTime: number = new Date().getTime();
                const TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
                const percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));
                if (percentage < 50) {
                    itemSubDeptCheckListModel.RAG = 'statusGreen';
                } else if (percentage >= 100) {
                    itemSubDeptCheckListModel.RAG = 'statusRed';
                }
                else {
                    itemSubDeptCheckListModel.RAG = 'statusAmber';
                }
            });
        });
    }

    ngOnDestroy(): void {
        // this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChangeFromDashboard');
        this.globalState.Unsubscribe('checkListStatusChange');
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getActionableCount(this.currentIncidentId, this.currentDepartmentId);
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getActionableCount(this.currentIncidentId, this.currentDepartmentId);
    }

    private checkListStatusChangeHandler(): void {
        this.getActionableCount(this.currentIncidentId, this.currentDepartmentId);
    }
}