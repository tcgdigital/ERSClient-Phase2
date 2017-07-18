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
                    item["Isselected"] = false;
                    this.departmentsToBroadcastToShow.push();
                    this.items.push(new KeyValue(x.DepartmentName, x.DepartmentId));
                });
            })
    }


    GetBroadcastsDepartmentMappingByDepartmentId(departmentId: number): void {
        this.broadcastdepartmentmappingservice.Query(departmentId)
            .subscribe((response: ResponseModel<BroadCastDepartmentModel>) => {
                this.departmentsToBroadcastToShow = _.without(this.departmentsToBroadcastToShow, _.findWhere(this.departmentsToBroadcastToShow, { DepartmentId: departmentId }));
                if (response.Records.length > 0) {
                    response.Records.forEach(x => {
                        _.findWhere(this.departmentsToBroadcastToShow, { DepartmentId: x.TargetDepartmentId })["Isselected"] = true;
                    });
                }
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
        this.GetBroadcastsDepartmentMappingByDepartmentId( this.selectedInitiateDept);
        // this.emergencyDepartmentService.GetFilterByEmergencyType(message.Value)
        //     .subscribe((response: ResponseModel<EmergencyDepartmentModel>) => {
        //         this.departmentsForEmergency = this.SetAllSelectedToFalse(this.departmentsForEmergencyConstant);
        //         for (let item2 of this.departmentsForEmergency) {
        //             if (response.Count != 0) {
        //                 for (let departmentEmergency of response.Records) {
        //                     if (item2.DepartmentId == departmentEmergency.DepartmentId) {
        //                         item2.IsSelected = true;
        //                     }
        //                 }
        //             }
        //         }
        //         this.checkAllStatus();
        //     });
    };

    // istrue(item: DepartmesForEmergency) {
    //     return item.IsSelected == true;
    // };

    // slectAllDept(value: any): void {
    //     this.departmentsForEmergency.forEach(x => {
    //         x.IsSelected = value.checked;
    //     });
    // }

    // checkAllStatus(): void {
    //     this.allselect = ((this.departmentsForEmergency.length != 0) && (this.departmentsForEmergency.filter(x => {
    //         return x.IsSelected == true;
    //     }).length == this.departmentsForEmergency.length));
    // }
    // invokeReset(): void {
    //     this.departmentsForEmergency = [];
    //     this.allselect = false;
    // }

    // save(): void {
    //     let model = this.departmentsForEmergency.filter(this.istrue);
    //     let selectedEmergencyType = this.selectedEmergencyType;
    //     let datenow = this.date;
    //     let userId = +this.credential.UserId;
    //     this.emergencyDepartmentModelToSave = model.map(function (data) {
    //         {
    //             let item = new EmergencyDepartmentModel();
    //             item.EmergencyTypeDepartmentId = 0;
    //             item.EmergencyTypeId = selectedEmergencyType;
    //             item.DepartmentId = data.DepartmentId;
    //             item.ActiveFlag = 'Active';
    //             item.CreatedBy = userId;
    //             item.CreatedOn = datenow;
    //             return item;
    //         }
    //     });
    //     this.emergencyDepartmentService.CreateBulk(this.emergencyDepartmentModelToSave)
    //         .subscribe((response: EmergencyDepartmentModel[]) => {
    //             this.toastrService.success('Emergency wise department saved Successfully.', 'Success', this.toastrConfig);
    //         }, (error: any) => {
    //             console.log(`Error: ${error}`);
    //         });
    // };

    ngOnInit(): any {
        this.getAlldepartments();
        this.credential = UtilityService.getCredentialDetails();
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