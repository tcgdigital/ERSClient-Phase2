import { UtilityService, GlobalConstants } from '../../shared';
import * as _ from 'underscore';
import { ChecklistTrailModel } from "../shared.components/checklist.trail";
import { DeptCheckListModel } from './checklist.summary.widget/checklist.summary.widget.model';
import { ActionableStatusLogModel } from "../shared.components/actionablestatuslog";
import { DemandStatusLogModel } from "../shared.components/demandstatuslog";
import {
    GraphObject
} from './demand.raised.summary.widget/demand.raised.summary.widget.model';

export class WidgetUtilityService {
    public static elapsedHourForGraph: number = GlobalConstants.ELAPSED_HOUR_COUNT_FOR_DEMAND_GRAPH_CREATION;

    public static GetGraphCheckList(requesterDepartmentId: number, Highcharts: any, arrGraphData: ActionableStatusLogModel[],
        containerName: string, graphSubjectType: string, emergencyDate: Date, departmentName: string): void {
        this.elapsedHourForGraph = GlobalConstants.ELAPSED_HOUR_COUNT_FOR_DEMAND_GRAPH_CREATION;
        let DepartmentName = departmentName;
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

        let closedTotal: number = 0;
        let pendingTotal: number = 0;
        let pendingInter: number = 0;
        const array: ActionableStatusLogModel[] = _.unique(arrGraphData, (item: ActionableStatusLogModel) => {
            return item.CompletionStatusChangedOn;
        });


        const dates: string[] = _.pluck(array, 'CompletionStatusChangedOn');
        const dateDate: Date[] = _.map(dates, (item) => {
            return new Date(item);
        });

        const dateDateSorted = _.sortBy(dateDate, (item) => {
            return item;
        });

        this.elapsedHourForGraph = dateDateSorted.length;
        let totalCount: number = 0;
        for (let i: number = 1; i <= this.elapsedHourForGraph - 1; i++) {

            let pendingOld: number = 0;

            let filteredTotal: ActionableStatusLogModel[] = arrGraphData
                .filter((item: ActionableStatusLogModel) => {
                    return new Date(item.CompletionStatusChangedOn).getFullYear() == new Date(dateDateSorted[i]).getFullYear() &&
                        new Date(item.CompletionStatusChangedOn).getMonth() == new Date(dateDateSorted[i]).getMonth() &&
                        new Date(item.CompletionStatusChangedOn).getDay() == new Date(dateDateSorted[i]).getDay() &&
                        new Date(item.CompletionStatusChangedOn).getHours() == new Date(dateDateSorted[i]).getHours() &&
                        new Date(item.CompletionStatusChangedOn).getMinutes() == new Date(dateDateSorted[i]).getMinutes() &&
                        new Date(item.CompletionStatusChangedOn).getSeconds() == new Date(dateDateSorted[i]).getSeconds();
                });

            totalCount = filteredTotal.length;

            let closed: ActionableStatusLogModel[] = filteredTotal
                .filter((x: ActionableStatusLogModel) => {
                    return x.CompletionStatus == 'Closed';
                });
            arrGraphCompleted.push(closed.length);

            let pending: ActionableStatusLogModel[] = filteredTotal
                .filter((x: ActionableStatusLogModel) => {
                    return x.CompletionStatus != 'Closed';
                });
            arrGraphPending.push(pending.length);
        }
        this.setGraphData(Highcharts, DepartmentName, arrGraphCompleted, arrGraphPending, containerName, 'Checklist', graphSubjectType, dateDateSorted);
    }

    public static diff_minutes(dt2: Date, dt1: Date): number {

        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60;
        return Math.abs(Math.round(diff));

    }

    public static GetGraphDemand(requesterDepartmentId: number, Highcharts: any, arrGraphData: DemandStatusLogModel[],
        containerName: string, graphSubjectType: string, emergencyDate: Date, departmentType: string): void {
        let DepartmentName: string = '';
        console.log(requesterDepartmentId);
        if (departmentType == 'TargetDepartment') {
            DepartmentName = arrGraphData[0].TargetDepartment.Description;
        }
        else {
            DepartmentName = arrGraphData[0].RequesterDepartment.Description;
        }

        this.elapsedHourForGraph = GlobalConstants.ELAPSED_HOUR_COUNT_FOR_DEMAND_GRAPH_CREATION;
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

        let closedTotal: number = 0;
        let pendingTotal: number = 0;
        let pendingInter: number = 0;
       
        

        const array: DemandStatusLogModel[] = _.unique(arrGraphData, (item: DemandStatusLogModel) => {
            return item.DemandStatusDescriptionChangedOn;
        });


        const dates: string[] = _.pluck(array, 'DemandStatusDescriptionChangedOn');
        const dateDate: Date[] = _.map(dates, (item) => {
            return new Date(item);
        });

        const dateDateSorted = _.sortBy(dateDate, (item) => {
            return item;
        });

        
        this.elapsedHourForGraph = dateDateSorted.length;
        
        let totalCount: number = 0;
        for (let i: number = 1; i <= this.elapsedHourForGraph - 1; i++) {
            let pendingOld: number = 0;

            let filteredTotal: DemandStatusLogModel[] = arrGraphData
                .filter((item: DemandStatusLogModel) => {
                    return new Date(item.DemandStatusDescriptionChangedOn).getFullYear() == new Date(dateDateSorted[i]).getFullYear() &&
                        new Date(item.DemandStatusDescriptionChangedOn).getMonth() == new Date(dateDateSorted[i]).getMonth() &&
                        new Date(item.DemandStatusDescriptionChangedOn).getDay() == new Date(dateDateSorted[i]).getDay() &&
                        new Date(item.DemandStatusDescriptionChangedOn).getHours() == new Date(dateDateSorted[i]).getHours() &&
                        new Date(item.DemandStatusDescriptionChangedOn).getMinutes() == new Date(dateDateSorted[i]).getMinutes() &&
                        new Date(item.DemandStatusDescriptionChangedOn).getSeconds() == new Date(dateDateSorted[i]).getSeconds();
                });

            totalCount = filteredTotal.length;

            let closed: DemandStatusLogModel[] = filteredTotal
                .filter((x: DemandStatusLogModel) => {
                    return x.DemandStatusDescription == 'Closed';
                });
            arrGraphCompleted.push(closed.length);

            let pending: DemandStatusLogModel[] = filteredTotal
                .filter((x: DemandStatusLogModel) => {
                    return x.DemandStatusDescription != 'Closed';
                });
            arrGraphPending.push(pending.length);




        }
        this.setGraphData(Highcharts, DepartmentName, arrGraphCompleted, arrGraphPending, containerName, 'Demand', graphSubjectType, dateDateSorted);
    }



    public static setGraphData(Highcharts: any, departmentName: string, arrGraphCompleted: number[],
        arrGraphPending: number[], containerName: string, moduleName: string, graphSubjectType: string, graphXAxis: Date[]): void {
        let x_axis_points: string[] = graphXAxis.map((item) => item.toLocaleDateString() + ' ' + item.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
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
                    text: 'Time'
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
                color: '#1E90FF'

            }, {
                name: 'Pending',
                data: arrGraphPending,
                color: '#00008B'
            }]
        });
    }
}