import { Component, ViewEncapsulation } from '@angular/core';
import { BroadCastDepartmentModel, BroadcastDepartmentService } from './components';

import { DepartmentService, DepartmentModel } from '../department';
import { ResponseModel, KeyValue, AuthModel, UtilityService } from '../../../shared';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import * as _ from 'underscore';
import { Subject } from 'rxjs';

@Component({
    selector: 'broadcastDepartment-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/broadcast.department.view.html',
    styleUrls: ['./styles/broadcastdepartment.scss']
})
export class BroadcastDepartmentComponent {
    departments: DepartmentModel[] = [];
    departmentsToBroadcastToShow: DepartmentModel[] = [];
    departmentsToBroadcastToSave: DepartmentModel[] = [];

    selectedInitiateDept: number;
    date: Date = new Date();
    credential: AuthModel;
    allselect: boolean = false;
    private items: KeyValue[] = [];
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private broadcastdepartmentmappingservice: BroadcastDepartmentService,
        private toastrService: ToastrService,
        private departmentService: DepartmentService,
        private toastrConfig: ToastrConfig) { }

    getAlldepartments(): void {
        this.departmentService.GetAll()
            .takeUntil(this.ngUnsubscribe)
            .subscribe((departments: ResponseModel<DepartmentModel>) => {
                this.departments = departments.Records;
                this.departments.forEach((x) => {
                    const item = Object.assign({}, x);
                    this.items.push(new KeyValue(x.DepartmentName, x.DepartmentId));
                });
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    setinitialdepartmentstobroadcast(): void {
        this.departmentsToBroadcastToShow = [];
        this.departments.forEach((x) => {
            const item = Object.assign({}, x);
            item['Isselected'] = false;
            this.departmentsToBroadcastToShow.push(item);
        });
    }

    GetBroadcastsDepartmentMappingByDepartmentId(departmentId: number): void {
        this.broadcastdepartmentmappingservice.Query(departmentId)
            .subscribe((response: ResponseModel<BroadCastDepartmentModel>) => {
                this.setinitialdepartmentstobroadcast();
                this.departmentsToBroadcastToShow = _.without(this.departmentsToBroadcastToShow,
                    _.findWhere(this.departmentsToBroadcastToShow, { DepartmentId: departmentId }));
                if (response.Records.length > 0) {
                    response.Records.forEach((x) => {
                        this.departmentsToBroadcastToShow.forEach((y) => {
                            if (y.DepartmentId == x.TargetDepartmentId) {
                                y['Isselected'] = true;
                            }
                        });
                    });
                }
                this.allselect = this.departmentsToBroadcastToShow.length != 0 && this.departmentsToBroadcastToShow
                    .filter((x) => x['Isselected']).length == this.departmentsToBroadcastToShow.length;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    onNotify(message: KeyValue): void {
        this.selectedInitiateDept = message.Value;
        this.GetBroadcastsDepartmentMappingByDepartmentId(this.selectedInitiateDept);
    }

    slectAllDept(value: any): void {
        this.departmentsToBroadcastToShow.forEach((x) => {
            x['Isselected'] = value.checked;
        });
    }

    onestatuschanged(value: any): void {
        this.allselect = this.departmentsToBroadcastToShow.length != 0 
            && (this.departmentsToBroadcastToShow.filter(x => x['Isselected']).length == this.departmentsToBroadcastToShow.length);
    }

    invokeReset(): void {
        this.departmentsToBroadcastToShow = [];
        this.allselect = false;
    }

    save(): void {
        if (!_.contains(_.pluck(this.departmentsToBroadcastToShow, 'Isselected'), true)) {
            this.toastrService.error('Please select atleast one department.', 'Error');
        }
        else {
            let model = _.where(this.departmentsToBroadcastToShow, { Isselected: true });
            let modeltosave: BroadCastDepartmentModel[] = [];
            let datenow = this.date;
            let userId = +this.credential.UserId;
            let selecteddept = this.selectedInitiateDept;

            modeltosave = model.map((x) => {
                let item: BroadCastDepartmentModel = new BroadCastDepartmentModel();
                item.InitiationDepartmentId = selecteddept;
                item.TargetDepartmentId = x.DepartmentId;
                item.ActiveFlag = 'Active';
                item.CreatedBy = userId;
                item.CreatedOn = datenow;
                return item;
            });

            this.broadcastdepartmentmappingservice.CreateBulk(modeltosave)
                .subscribe((response: BroadCastDepartmentModel[]) => {
                    this.toastrService.success('Departments mapped successfully to broadcast.', 'Success', this.toastrConfig);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                    this.invokeReset();
                });
        }
    }

    ngOnInit(): any {
        this.getAlldepartments();
        this.credential = UtilityService.getCredentialDetails();
        this.departmentsToBroadcastToShow = [];
    }
}