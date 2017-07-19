import { UtilityService, GlobalConstants } from '../../shared';
import * as _ from 'underscore';
import { ChecklistTrailModel } from "../shared.components/checklist.trail";
import { DeptCheckListModel } from './checklist.summary.widget/checklist.summary.widget.model';
import {
    GraphObject
} from './demand.raised.summary.widget/demand.raised.summary.widget.model';

export class WidgetUtilityService {
    public static elapsedHourForGraph: number = GlobalConstants.ELAPSED_HOUR_COUNT_FOR_DEMAND_GRAPH_CREATION;

    public static GetGraphCheckList(requesterDepartmentId: number, Highcharts: any, arrGraphData: ChecklistTrailModel[],
        containerName: string, graphSubjectType: string, emergencyDate: Date): void {
        this.elapsedHourForGraph = GlobalConstants.ELAPSED_HOUR_COUNT_FOR_DEMAND_GRAPH_CREATION;

        let DepartmentName = arrGraphData[0].Department.DepartmentName;
        let arrGraphPending: number[] = [];
        let arrGraphCompleted: number[] = [];

        let start: Date = new Date(emergencyDate);
        let temp: Date = new Date(emergencyDate);
        let inter: string = JSON.stringify(start);
        temp = new Date(JSON.parse(inter));
        temp = start;
        let end: Date = new Date(emergencyDate);
        end = start;
        inter = JSON.stringify(start);
        end = new Date(JSON.parse(inter));
        end.setMinutes(temp.getMinutes() + 60);

        // If the elapse hours is less than time since incident create then the elapse hour will be 
        // hour difference between now - incident create.

        let now: Date = new Date();
        let timediff: number = this.diff_minutes(now, new Date(emergencyDate));
        if (timediff < 60 && timediff < (this.elapsedHourForGraph * 60)) {
            this.elapsedHourForGraph = 1;
        }
        else if (timediff < (this.elapsedHourForGraph * 60) && timediff >= 60) {
            this.elapsedHourForGraph = ((timediff % 60) > 0 ? 1 : 0) + (Math.abs(timediff / 60));
        }
        else {
            this.elapsedHourForGraph = this.elapsedHourForGraph;
        }

        for (let i: number = 1; i <= this.elapsedHourForGraph; i++) {
            let pendingTotal: number = 0;
            let closedTotal: number = 0;
            let pendingOld: number = 0;

            ///////This is for demands which are created after crisis initiation and closed in this hour.
            let closeList: ChecklistTrailModel[] = arrGraphData.filter((x: ChecklistTrailModel) => x.CompletionStatus == 'Closed')
                .filter((x) => {
                    return ((temp <= new Date(x.CompletionStatusChangedOn) && new Date(x.CompletionStatusChangedOn) <= end));
                });
            closedTotal = closedTotal + closeList.length;
            arrGraphCompleted.push(closedTotal);


            //This is for demands which are created after crisis initiation but not yet closed.
            let pendingList: ChecklistTrailModel[] = arrGraphData.filter((x: ChecklistTrailModel) => {
                return ((x.CompletionStatus != 'Closed') && (temp <= new Date(x.CompletionStatusChangedOn)) && (new Date(x.CompletionStatusChangedOn) <= end));
            });
            pendingTotal = pendingList.length;
            if (i == 1) {
                pendingTotal = pendingTotal - closedTotal;
            }
            else {
                pendingOld = pendingTotal + arrGraphPending[i - 2] - closedTotal;
                pendingTotal = pendingOld;
            }
            arrGraphPending.push(pendingTotal);

            temp.setMinutes(temp.getMinutes() + 60);
            end.setMinutes(end.getMinutes() + 60);
        }
        this.setGraphData(Highcharts, DepartmentName, arrGraphCompleted, arrGraphPending, containerName, 'Checklist', graphSubjectType);
    }

    public static diff_minutes(dt2: Date, dt1: Date): number {

        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60;
        return Math.abs(Math.round(diff));

    }

    public static GetGraphDemand(requesterDepartmentId: number, Highcharts: any, arrGraphData: GraphObject[],
        containerName: string, graphSubjectType: string, emergencyDate: Date): void {
        console.log(requesterDepartmentId);
        this.elapsedHourForGraph = GlobalConstants.ELAPSED_HOUR_COUNT_FOR_DEMAND_GRAPH_CREATION;
        let filterDepartments = arrGraphData.filter((item: GraphObject) => {
            return item.requesterDepartmentId == requesterDepartmentId;
        });

        let DepartmentName = filterDepartments[0].requesterDepartmentName;

        let arrGraphPending: number[] = [];
        let arrGraphCompleted: number[] = [];

        let start: Date = new Date(emergencyDate);
        let temp: Date = new Date(emergencyDate);
        let inter: string = JSON.stringify(start);
        temp = new Date(JSON.parse(inter));
        temp = start;
        let end: Date = new Date(emergencyDate);
        end = start;
        inter = JSON.stringify(start);
        end = new Date(JSON.parse(inter));
        end.setMinutes(temp.getMinutes() + 60);

        // If the elapse hours is less than time since incident create then the elapse hour will be 
        // hour difference between now - incident create.

        let now: Date = new Date();
        let timediff: number = this.diff_minutes(now, new Date(emergencyDate));
        if (timediff < 60 && timediff < (this.elapsedHourForGraph * 60)) {
            this.elapsedHourForGraph = 1;
        }
        else if (timediff < (this.elapsedHourForGraph * 60) && timediff >= 60) {
            this.elapsedHourForGraph = ((timediff % 60) > 0 ? 1 : 0) + (Math.abs(timediff / 60));
        }
        else {
            this.elapsedHourForGraph = this.elapsedHourForGraph;
        }

        for (let i: number = 1; i <= this.elapsedHourForGraph; i++) {
            let pendingTotal: number = 0;
            let closedTotal: number = 0;
            let pendingOld: number = 0;

            ///////This is for demands which are created after crisis initiation and closed in this hour.
            let closeList: GraphObject[] = filterDepartments.filter((x) => x.closedOn != null)
                .filter((x) => {
                    return ((temp <= x.closedOn && x.closedOn <= end));
                });
            closedTotal = closedTotal + closeList.length;
            arrGraphCompleted.push(closedTotal);


            //This is for demands which are created after crisis initiation but not yet closed.
            let pendingList: GraphObject[] = filterDepartments.filter((x) => {
                return ((temp <= x.CreatedOn) && (x.CreatedOn <= end));
            });
            pendingTotal = pendingList.length;
            if (i == 1) {
                pendingTotal = pendingTotal - closedTotal;
            }
            else {
                pendingOld = pendingTotal + arrGraphPending[i - 2] - closedTotal;
                pendingTotal = pendingOld;
            }
            arrGraphPending.push(pendingTotal);

            temp.setMinutes(temp.getMinutes() + 60);
            end.setMinutes(end.getMinutes() + 60);
        }
        this.setGraphData(Highcharts, DepartmentName, arrGraphCompleted, arrGraphPending, containerName, 'Demand', graphSubjectType);
    }



    public static setGraphData(Highcharts: any, departmentName: string, arrGraphCompleted: number[],
        arrGraphPending: number[], containerName: string, moduleName: string, graphSubjectType: string): void {
        let x_axis_points: string[] = _.range(1, this.elapsedHourForGraph + 1).map((item) => item.toString());

        let y_axis_points: number[] = _.range(1, _.max(_.union(arrGraphPending, arrGraphCompleted)));


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
                crosshair: true,
                title: {
                    text: 'Time elapse (Hourly)'
                }
            },
            yAxis: {
                //categories: y_axis_points,
                //verticalAlign: 'bottom',
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
                name: 'Closed',
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