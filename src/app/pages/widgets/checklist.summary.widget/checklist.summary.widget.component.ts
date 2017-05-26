import {
    Component, OnInit, ViewEncapsulation,
    Input, ViewChild, OnDestroy
} from '@angular/core';
import { CheckListSummeryModel, DeptCheckListModel, SubDeptCheckListModel } from './checklist.summary.widget.model';
import { ChecklistSummaryWidgetService } from './checklist.summary.widget.service';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { Observable } from 'rxjs/Rx';
import { ActionableModel } from '../../shared.components/actionables/components/actionable.model';
import { ResponseModel, GlobalStateService, KeyValue } from '../../../shared';
import { DepartmentModel } from '../../masterdata/department/components/department.model';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'checklist-summary-widget',
    templateUrl: './checklist.summary.widget.view.html',
    styleUrls: ['./checklist.summary.widget.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ChecklistSummaryWidgetComponent implements OnInit, OnDestroy {
    @Input('initiatedDepartmentId') departmentId: number;
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
    currentDepartmentId: number;
    currentIncidentId: number;

    /**
     * Creates an instance of ChecklistSummaryWidgetComponent.
     * @param {ChecklistSummaryWidgetService} checklistSummaryWidgetService
     *
     * @memberOf ChecklistSummaryWidgetComponent
     */
    constructor(private checklistSummaryWidgetService: ChecklistSummaryWidgetService,
        private globalState: GlobalStateService) { }

    public ngOnInit(): void {
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.departmentId;
        this.getActionableCount(this.currentIncidentId, this.currentDepartmentId);

        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));
        this.globalState.Subscribe('checkListStatusChange', () => this.checkListStatusChangeHandler());
        this.showAllDeptSubChecklistCompleted = false;
        this.showAllDeptSubChecklistPending = false;

        this.setChecklistGraphData();
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
        const deptCheckListsLocal: DeptCheckListModel[] = [];
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
                        return item.CompletionStatus === 'Open';
                    }).length;

                    depCM.completed = actionableListOfSameDepartment.filter((item: ActionableModel) => {
                        return item.CompletionStatus === 'Close';
                    }).length;
                    deptCheckListsLocal.push(depCM);
                });
                this.deptCheckListsAll = Observable.of(deptCheckListsLocal);
                if (callback) {
                    callback();
                }
            });
    }

    public ViewSubDeptChecklist(callback?: () => void): void {
        const deptCheckListsLocal: DeptCheckListModel[] = [];
        const data: ActionableModel[] = [];
        const uniqueDepartments: DepartmentModel[] = [];
        this.checklistSummaryWidgetService.GetAllSubDepartmentChecklists(this.incidentId, this.departmentId)
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
                        return item.CompletionStatus === 'Open';
                    }).length;

                    depCM.completed = actionableListOfSameDepartment.filter((item: ActionableModel) => {
                        return item.CompletionStatus === 'Close';
                    }).length;
                    deptCheckListsLocal.push(depCM);
                });
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
            return item.CompletionStatus === 'Close';
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
            return item.CompletionStatus === 'Open';
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
        const CurrentTime: number = new Date(itemActionable.ClosedOn).getTime();
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
            return item.CompletionStatus === 'Close';
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
            return item.CompletionStatus === 'Open';
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
        const CurrentTime: number = new Date(itemActionable.ClosedOn).getTime();
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
        this.globalState.Unsubscribe('incidentChange');
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

    private setChecklistGraphData(): void {
        Highcharts.chart('checklist-graph-container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Monthly Average Rainfall'
            },
            subtitle: {
                text: 'Source: WorldClimate.com'
            },
            xAxis: {
                categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Rainfall (mm)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Tokyo',
                data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

            }, {
                name: 'New York',
                data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

            }]
        });
    }
}