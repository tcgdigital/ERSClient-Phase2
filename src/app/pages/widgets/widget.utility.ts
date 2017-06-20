import { UtilityService, GlobalConstants } from '../../shared';
import * as _ from 'underscore';
import { DeptCheckListModel } from './checklist.summary.widget/checklist.summary.widget.model';
import {
    GraphObject
} from './demand.raised.summary.widget/demand.raised.summary.widget.model';

export class WidgetUtilityService {
    public static elapsedHourForGraph: number = GlobalConstants.ELAPSED_HOUR_COUNT_FOR_DEMAND_GRAPH_CREATION;

    public static GetGraphCheckList(requesterDepartmentId: number, Highcharts: any, arrGraphData: GraphObject[], containerName: string): void {
        console.log(requesterDepartmentId);
        // let filteredEntities: DeptCheckListModel[] = entities.filter((item) => {
        //     return item.departmentId == requesterDepartmentId;
        // });


        let filterDepartments = arrGraphData.filter((item: GraphObject) => {
            return item.requesterDepartmentId == requesterDepartmentId;
        });

        let DepartmentName = filterDepartments[0].requesterDepartmentName;
        let ConfigurationHoursBackTime: Date = new Date();
        ConfigurationHoursBackTime.setMinutes(ConfigurationHoursBackTime.getMinutes() - (this.elapsedHourForGraph * 60));

        // Created count array
        let limitPoint: Date = new Date();
        let arrGraphPending: number[] = [];
        let arrGraphCompleted: number[] = [];
        let pendingCount: number = 0;
        let completedCount: number = 0;
        let stepPoint: Date = new Date();
        let totalCompletedCountPresent: number = filterDepartments.filter((item: GraphObject) => item.isClosed === true).length;
        let totalPendingCountPresent: number = filterDepartments.filter((item: GraphObject) => item.isClosed === false).length;
        let totalCount: number = totalCompletedCountPresent + totalPendingCountPresent;
        stepPoint = new Date(limitPoint.toString());
        stepPoint.setMinutes(stepPoint.getMinutes() - (this.elapsedHourForGraph * 60));
        for (let i: number = this.elapsedHourForGraph; i >= 1; i--) {


            let completedList: GraphObject[] =
                filterDepartments.filter((x) => x.closedOn != null)
                    .filter((x) => {
                        return ((stepPoint <= x.closedOn && x.closedOn < limitPoint)
                            || (stepPoint <= x.closedOn && x.closedOn <= limitPoint
                                && i === this.elapsedHourForGraph));
                    });

            totalPendingCountPresent = totalCount - completedList.length;
            totalCompletedCountPresent = completedList.length;

            arrGraphCompleted.push(totalCompletedCountPresent);
            arrGraphPending.push(totalPendingCountPresent);
            limitPoint.setMinutes(limitPoint.getMinutes() + 60);
            //limitPoint = new Date(stepPoint.toString());
        }
        //this.setGraphData(Highcharts, DepartmentName, arrGraphCompleted.reverse(), arrGraphPending.reverse(), containerName, 'CheckList');
    }

    public static GetGraphDemand(requesterDepartmentId: number, Highcharts: any, arrGraphData: GraphObject[], containerName: string, graphSubjectType: string): void {
        console.log(requesterDepartmentId);
        let filterDepartments = arrGraphData.filter((item: GraphObject) => {
            return item.requesterDepartmentId == requesterDepartmentId;
        });

        let DepartmentName = filterDepartments[0].requesterDepartmentName;
        let ConfigurationHoursBackTime: Date = new Date();
        ConfigurationHoursBackTime.setMinutes(ConfigurationHoursBackTime.getMinutes() - (this.elapsedHourForGraph * 60));

        let arrGraphPending: number[] = [];
        let arrGraphCompleted: number[] = [];
        let pendingCount: number = 0;
        let completedCount: number = 0;
        let actualCompletedCount: number = 0;
        let startPoint: Date = new Date();
        let endPoint: Date = new Date();
        let startCompletedPoint: Date = new Date();
        let endCompletedPoint: Date = new Date();
        endCompletedPoint.setMinutes(endCompletedPoint.getMinutes() - 60);

        let totalCompletedCountPresent: number = filterDepartments.filter((item: GraphObject) => item.isClosed === true).length;
        let totalPendingCountPresent: number = filterDepartments.filter((item: GraphObject) => item.isClosed === false).length;
        let totalCount: number = totalCompletedCountPresent + totalPendingCountPresent;
        endPoint.setMinutes(endPoint.getMinutes() - (this.elapsedHourForGraph * 60));
        for (let i: number = this.elapsedHourForGraph; i >= 1; i--) {
            let completedList: GraphObject[] =
                filterDepartments.filter((x) => x.closedOn != null)
                    .filter((x) => {
                        return ((startPoint > x.closedOn && x.closedOn >= endPoint)
                            || (startPoint >= x.closedOn && x.closedOn >= endPoint
                                && i === this.elapsedHourForGraph));
                    });

            pendingCount = totalCount - completedList.length;
            completedCount = completedList.length;

            let actualCompletedList: GraphObject[] =
                filterDepartments.filter((x) => x.closedOn != null)
                    .filter((x) => {
                        return ((startCompletedPoint > x.closedOn && x.closedOn >= endCompletedPoint)
                            || (startCompletedPoint >= x.closedOn && x.closedOn >= endCompletedPoint
                                && i === this.elapsedHourForGraph));
                    });
            arrGraphCompleted.push(actualCompletedList.length);
            arrGraphPending.push(pendingCount);
            startPoint.setMinutes(startPoint.getMinutes() - 60);
            startCompletedPoint.setMinutes(startCompletedPoint.getMinutes() - 60);
            endCompletedPoint.setMinutes(endCompletedPoint.getMinutes() - 60);
        }
        this.setGraphData(Highcharts, DepartmentName, arrGraphCompleted.reverse(), arrGraphPending.reverse(), containerName, 'Demand', graphSubjectType);
    }



    public static setGraphData(Highcharts: any, departmentName: string, arrGraphCompleted: number[],
        arrGraphPending: number[], containerName: string, moduleName: string, graphSubjectType: string): void {
        let x_axis_points: string[] = _.range(1, this.elapsedHourForGraph + 1).map((item) => item.toString());
        Highcharts.chart(containerName, {
            chart: {
                type: 'column'
            },
            title: {
                text: `Hourly ${moduleName} ${graphSubjectType}`
            },
            subtitle: {
                text: `Selected department: ${departmentName}`
            },
            xAxis: {
                categories: x_axis_points,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: `${moduleName} Count`
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key} Hour</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
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
            credits: {
                enabled: false
            },
            series: [{
                name: 'Completed',
                data: arrGraphCompleted,
                color: '#119272'

            }, {
                name: 'Pending',
                data: arrGraphPending,
                color: '#f8a920'
            }]
        });
    }
}