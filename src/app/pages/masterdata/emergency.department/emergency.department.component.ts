import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

import { DepartmentService, DepartmentModel } from '../department';
import { EmergencyTypeService, EmergencyTypeModel } from '../emergencytype';
import { EmergencyTypeDepartmentService } from './components/emergency.department.service';
import { EmergencyDepartmentModel, DepartmesForEmergency } from './components/emergency.department.model';
import { ResponseModel, KeyValue, AuthModel, UtilityService, GlobalConstants } from '../../../shared';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';

@Component({
    selector: 'emergency-department-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/emergency-department.view.html',
    styleUrls: ['./styles/emergency.department.style.scss']
})
export class EmergencyDepartmentComponent implements OnInit, OnDestroy {
    emergencyTypeItems: EmergencyTypeModel[] = [];
    departments: DepartmentModel[] = [];
    departmentsForEmergency: DepartmesForEmergency[] = [];
    departmentsForEmergencyConstant: DepartmesForEmergency[] = [];
    emergencyDepartmentModelToSave: EmergencyDepartmentModel[] = [];
    selectedEmergencyType: number;
    date: Date = new Date();
    private items: Array<KeyValue> = [];
    credential: AuthModel;
    allselect: boolean = false;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     *Creates an instance of EmergencyDepartmentComponent.
     * @param {EmergencyTypeDepartmentService} emergencyDepartmentService
     * @param {EmergencyTypeService} emergencyTypeService
     * @param {DepartmentService} departmentService
     * @param {ToastrService} toastrService
     * @param {ToastrConfig} toastrConfig
     * @memberof EmergencyDepartmentComponent
     */
    constructor(private emergencyDepartmentService: EmergencyTypeDepartmentService,
        private emergencyTypeService: EmergencyTypeService,
        private departmentService: DepartmentService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) { };

    getEmergencyTypes(): void {
        this.emergencyTypeService.GetAll()
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<EmergencyTypeModel>) => {
                this.emergencyTypeItems = response.Records;
                for (let emergencyType of this.emergencyTypeItems) {
                    this.items.push(new KeyValue(emergencyType.EmergencyTypeName, emergencyType.EmergencyTypeId));
                }
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
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
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
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
                this.checkAllStatus();
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    };

    istrue(item: DepartmesForEmergency) {
        return item.IsSelected == true;
    };

    slectAllDept(value: any): void {
        this.departmentsForEmergency.forEach(x => {
            x.IsSelected = value.checked;
        });
    }

    checkAllStatus(): void {
        this.allselect = ((this.departmentsForEmergency.length != 0) && (this.departmentsForEmergency.filter(x => {
            return x.IsSelected == true;
        }).length == this.departmentsForEmergency.length));
    }

    invokeReset(): void {
        this.departmentsForEmergency = [];
        this.allselect = false;
    }

    save(): void {
        let model = this.departmentsForEmergency.filter(this.istrue);
        let selectedEmergencyType = this.selectedEmergencyType;
        let datenow = this.date;
        let userId = +this.credential.UserId;
        this.emergencyDepartmentModelToSave = model.map(function (data) {
            {
                let item = new EmergencyDepartmentModel();
                item.EmergencyTypeDepartmentId = 0;
                item.EmergencyTypeId = selectedEmergencyType;
                item.DepartmentId = data.DepartmentId;
                item.ActiveFlag = 'Active';
                item.CreatedBy = userId;
                item.CreatedOn = datenow;
                return item;
            }
        });
        if (this.emergencyDepartmentModelToSave && this.emergencyDepartmentModelToSave.length > 0)
            this.emergencyDepartmentService.CreateBulk(this.emergencyDepartmentModelToSave)
                .subscribe((response: EmergencyDepartmentModel[]) => {
                    this.toastrService.success('Crisis wise department saved Successfully.', 'Success', this.toastrConfig);
                }, (error: any) => {
                    console.log(`Error: ${error.message}`);
                });
    };

    ngOnInit(): any {
        this.getEmergencyTypes();
        this.credential = UtilityService.getCredentialDetails();

        this.departmentService.GetAll()
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                this.departments = response.Records;
                for (let department of this.departments) {
                    let item1 = new DepartmesForEmergency();
                    item1.DepartmentId = department.DepartmentId;
                    item1.DepartmentName = department.DepartmentName;
                    item1.IsSelected = false;
                    this.departmentsForEmergencyConstant.push(item1);
                }
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}