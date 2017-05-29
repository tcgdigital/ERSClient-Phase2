import { UtilityService, GlobalConstants } from '../../shared';
import * as _ from 'underscore';
import {
    GraphObject
} from './demand.raised.summary.widget/demand.raised.summary.widget.model';

export class WidgetUtilityService {
    public static elapsedHourForGraph: number = GlobalConstants.ELAPSED_HOUR_COUNT_FOR_DEMAND_GRAPH_CREATION;

    public static GetDemandGraph(requesterDepartmentId: number, Highcharts: any, arrGraphData: GraphObject[],containerName:string): void {
        console.log(requesterDepartmentId);
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

        for (let i: number = this.elapsedHourForGraph; i >= 1; i--) {
            stepPoint = new Date(limitPoint.toString());
            stepPoint.setMinutes(stepPoint.getMinutes() - 60);

            let completedList: GraphObject[] =
                filterDepartments.filter((x) => x.closedOn != null)
                    .filter((x) => {
                        return ((stepPoint <= x.closedOn && x.closedOn < limitPoint)
                            || (stepPoint <= x.closedOn && x.closedOn <= limitPoint
                                && i === this.elapsedHourForGraph));
                    });

            if (completedList.length > 0) {
                pendingCount = totalCompletedCountPresent - completedList.length;
                totalPendingCountPresent = pendingCount;
                completedCount = completedList.length;
            }
            else {
                pendingCount = totalPendingCountPresent;
                completedCount = 0;
            }
            totalCompletedCountPresent = totalPendingCountPresent;

            arrGraphCompleted.push(completedCount);
            arrGraphPending.push(pendingCount);
            limitPoint = new Date(stepPoint.toString());
        }
        this.setDemandRaisedGraphData(Highcharts, DepartmentName, arrGraphCompleted, arrGraphPending,containerName);
    }

    public static setDemandRaisedGraphData(Highcharts: any, departmentName: string, arrGraphCompleted: number[],
     arrGraphPending: number[],containerName:string): void {
        let x_axis_points: string[] = _.range(1, this.elapsedHourForGraph + 1).map((item) => item.toString());
        Highcharts.chart(containerName, {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Hourly Demand Raised'
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
                    text: 'Demand Count'
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