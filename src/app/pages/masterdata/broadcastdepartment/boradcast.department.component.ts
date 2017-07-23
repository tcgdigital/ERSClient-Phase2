import { Component, ViewEncapsulation } from '@angular/core';
import { BroadCastDepartmentModel, BroadcastDepartmentService } from './components';

import { DepartmentService, DepartmentModel } from '../department';
import { ResponseModel, DataExchangeService, AutocompleteComponent, KeyValue, AuthModel, UtilityService } from '../../../shared';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import * as _ from 'underscore';


@Component({
    selector: 'broadcastDepartment-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/broadcast.department.view.html'
})
export class BroadcastDepartmentComponent {
    departments: DepartmentModel[] = [];
    constdepartmentsto
    departmentsToBroadcastToShow: DepartmentModel[] = [];
    departmentsToBroadcastToSave: DepartmentModel[] = [];

    // departmentsToBroadcast: DepartmentModel[] = [];

    selectedInitiateDept: number;
    date: Date = new Date();
    private items: Array<KeyValue> = [];
    credential: AuthModel;
    allselect: boolean = false;

    constructor(private broadcastdepartmentmappingservice: BroadcastDepartmentService, private toastrService: ToastrService,
        private departmentService: DepartmentService,
        private toastrConfig: ToastrConfig) { };


    getAlldepartments(): void {
        this.departmentService.GetAll()
            .subscribe((departments: ResponseModel<DepartmentModel>) => {
                this.departments = departments.Records;
                this.departments.forEach(x => {
                    let item = Object.assign({}, x);
                    //   item["Isselected"] = false;
                    // this.departmentsToBroadcastToShow.push(item);
                    this.items.push(new KeyValue(x.DepartmentName, x.DepartmentId));
                });

            })
    }
    setinitialdepartmentstobroadcast(): void {
        this.departmentsToBroadcastToShow = [];
        this.departments.forEach(x => {
            let item = Object.assign({}, x);
            item["Isselected"] = false;
            this.departmentsToBroadcastToShow.push(item);
            // this.items.push(new KeyValue(x.DepartmentName, x.DepartmentId));
        });
    }


    GetBroadcastsDepartmentMappingByDepartmentId(departmentId: number): void {
        this.departments
        this.broadcastdepartmentmappingservice.Query(departmentId)
            .subscribe((response: ResponseModel<BroadCastDepartmentModel>) => {
                this.setinitialdepartmentstobroadcast();
                debugger;
                this.departmentsToBroadcastToShow = _.without(this.departmentsToBroadcastToShow, _.findWhere(this.departmentsToBroadcastToShow, { DepartmentId: departmentId }));
                if (response.Records.length > 0) {
                    response.Records.forEach(x => {
                        this.departmentsToBroadcastToShow.forEach(y => {
                            if (y.DepartmentId == x.TargetDepartmentId) {
                                y["Isselected"] = true;
                            }
                        });
                        // _.findWhere(this.departmentsToBroadcastToShow, { DepartmentId: x.TargetDepartmentId })["Isselected"] = true;
                    });
                }
                this.allselect = this.departmentsToBroadcastToShow.length != 0 && this.departmentsToBroadcastToShow.filter(x => x["Isselected"]).length == this.departmentsToBroadcastToShow.length;
            });
    };

    // SetAllSelectedToFalse(departmentForEmergencyModel: DepartmesForEmergency[]): any {
    //     for (let item of departmentForEmergencyModel) {
    //         item.IsSelected = false;
    //     }
    //     return departmentForEmergencyModel;
    // }

    onNotify(message: KeyValue): void {
        this.selectedInitiateDept = message.Value;
        this.GetBroadcastsDepartmentMappingByDepartmentId(this.selectedInitiateDept);
    };

    // istrue(item: DepartmesForEmergency) {
    //     return item.IsSelected == true;
    // };

    slectAllDept(value: any): void {
        debugger;
        this.departmentsToBroadcastToShow.forEach(x => {
            x["Isselected"] = value.checked;
        });
    }

    onestatuschanged(value: any): void {
        this.allselect = this.departmentsToBroadcastToShow.length != 0 && (this.departmentsToBroadcastToShow.filter(x => x["Isselected"]).length == this.departmentsToBroadcastToShow.length);

    }

    // checkAllStatus(): void {
    //     this.allselect = ((this.departmentsForEmergency.length != 0) && (this.departmentsForEmergency.filter(x => {
    //         return x.IsSelected == true;
    //     }).length == this.departmentsForEmergency.length));
    // }
    invokeReset(): void {
        this.departmentsToBroadcastToShow = [];
        this.allselect = false;
    }

    save(): void {
        if (!_.contains(_.pluck(this.departmentsToBroadcastToShow, 'Isselected'), true)) {
            this.toastrService.error("Please select atleast one department.", 'Error');
        }
        else {
            let model = _.where(this.departmentsToBroadcastToShow, { Isselected: true });
            let modeltosave: BroadCastDepartmentModel[] = [];
            let datenow = this.date;
            let userId = +this.credential.UserId;
            let selecteddept = this.selectedInitiateDept;
            modeltosave = model.map(x => {
                let item: BroadCastDepartmentModel = new BroadCastDepartmentModel();
                item.InitiationDepartmentId = selecteddept;
                item.TargetDepartmentId = x.DepartmentId;
                item.ActiveFlag = 'Active';
                item.CreatedBy = userId;
                item.CreatedOn = datenow;
                return item;
            })
            this.broadcastdepartmentmappingservice.CreateBulk(modeltosave)
            .subscribe((response: BroadCastDepartmentModel[]) => {
                this.toastrService.success('Departments mapped successfully to broadcast.', 'Success', this.toastrConfig);
                this.invokeReset();
            }, (error: any) => {
                console.log(`Error: ${error}`);
                this.invokeReset();
            });
        }
        // let model = this.departmentsForEmergency.filter(this.istrue);
        // let selectedEmergencyType = this.selectedEmergencyType;
        

        // this.emergencyDepartmentModelToSave = model.map(function (data) {
        //     {
        //         let item = new EmergencyDepartmentModel();
        //         item.EmergencyTypeDepartmentId = 0;
        //         item.EmergencyTypeId = selectedEmergencyType;
        //         item.DepartmentId = data.DepartmentId;
        //         item.ActiveFlag = 'Active';
        //         item.CreatedBy = userId;
        //         item.CreatedOn = datenow;
        //         return item;
        //     }
        // });
        
    };

    ngOnInit(): any {
        this.getAlldepartments();
        this.credential = UtilityService.getCredentialDetails();
        this.departmentsToBroadcastToShow = [];
        // this.departmentService.GetAll()
        //     .subscribe((response: ResponseModel<DepartmentModel>) => {
        //         this.departments = response.Records;
        //         for (let department of this.departments) {
        //             let item1 = new DepartmesForEmergency();
        //             item1.DepartmentId = department.DepartmentId;
        //             item1.DepartmentName = department.DepartmentName;
        //             item1.IsSelected = false;
        //             this.departmentsForEmergencyConstant.push(item1);
        //         }
        //     });
    }
}