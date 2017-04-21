import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { DepartmentService, DepartmentModel } from '../department';
import { EmergencyTypeService, EmergencyTypeModel } from '../emergencytype';
import { EmergencyTypeDepartmentService } from './components/emergency.department.service';
import { EmergencyDepartmentModel, DepartmesForEmergency } from './components/emergency.department.model';
import { ResponseModel, DataExchangeService, AutocompleteComponent, KeyValue } from '../../../shared';

@Component({
    selector: 'emergency-department-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/emergency-department.view.html',
    styleUrls:['./styles/emergency.department.style.scss']
})
export class EmergencyDepartmentComponent {
    emergencyTypeItems: EmergencyTypeModel[] = [];
    departments: DepartmentModel[] = [];
    departmentsForEmergency: DepartmesForEmergency[] = [];
    departmentsForEmergencyConstant: DepartmesForEmergency[] = [];
    emergencyDepartmentModelToSave: EmergencyDepartmentModel[] = [];
    selectedEmergencyType: number;
    date: Date = new Date();
    private items: Array<KeyValue> = [];

    constructor(private emergencyDepartmentService: EmergencyTypeDepartmentService, private emergencyTypeService: EmergencyTypeService,
        private departmentService: DepartmentService) { };

    getEmergencyTypes(): void {
        this.emergencyTypeService.GetAll()
            .subscribe((response: ResponseModel<EmergencyTypeModel>) => {
                this.emergencyTypeItems = response.Records;
                for (let emergencyType of this.emergencyTypeItems) {
                    this.items.push(new KeyValue(emergencyType.EmergencyTypeName, emergencyType.EmergencyTypeId));
                }
            });
    };

    SetAllSelectedToFalse(departmentForEmergencyModel: DepartmesForEmergency[]): any {
        for (let item of departmentForEmergencyModel) {
            item.IsSelected = false;
        }
        return departmentForEmergencyModel;
    }

    onNotify(message: KeyValue): void {
        this.selectedEmergencyType = message.Value;
        this.emergencyDepartmentService.GetFilterByEmergencyType(message.Value)
            .subscribe((response: ResponseModel<EmergencyDepartmentModel>) => {
                this.departmentsForEmergency = this.SetAllSelectedToFalse(this.departmentsForEmergencyConstant);
                for (let item2 of this.departmentsForEmergency) {
                    if (response.Count != 0) {
                        for (let departmentEmergency of response.Records) {
                            if (item2.DepartmentId == departmentEmergency.DepartmentId) {
                                item2.IsSelected = true;
                            }
                        }
                    }
                }
            });
    };

    istrue(item: DepartmesForEmergency) {
        return item.IsSelected == true;
    };

    save(): void {
        let model = this.departmentsForEmergency.filter(this.istrue);
        let selectedEmergencyType = this.selectedEmergencyType;
        let datenow=this.date;
        this.emergencyDepartmentModelToSave = model.map(function (data) {
            {
                let item = new EmergencyDepartmentModel();
                item.EmergencyTypeDepartmentId = 0;
                item.EmergencyTypeId = selectedEmergencyType;
                item.DepartmentId = data.DepartmentId;
                item.ActiveFlag = 'Active';
                item.CreatedBy = 1;
                item.CreatedOn = datenow;
                return item;
            }
        });
        this.emergencyDepartmentService.CreateBulk(this.emergencyDepartmentModelToSave)
            .subscribe((response: EmergencyDepartmentModel[]) => {
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    ngOnInit(): any {
        this.getEmergencyTypes();
        this.departmentService.GetAll()
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                this.departments = response.Records;
                for (let department of this.departments) {
                    let item1 = new DepartmesForEmergency();
                    item1.DepartmentId = department.DepartmentId;
                    item1.DepartmentName = department.DepartmentName;
                    item1.IsSelected = false;
                    this.departmentsForEmergencyConstant.push(item1);
                }
            });
    }
}