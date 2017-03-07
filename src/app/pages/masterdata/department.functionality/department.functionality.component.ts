import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { DepartmentService, DepartmentModel } from '../department';
import { PageService, PagePermissionService } from './components';
import {
    PageModel, PagePermissionModel,
    PagesForDepartmentModel
} from './components/department.functionality.model';
import {
    DataExchangeService, ResponseModel,
    AutocompleteComponent, KeyValue
} from '../../../shared';


@Component({
    selector: 'department-functionality',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/department.functionality.view.html'
})
export class DepartmentFunctionalityComponent implements OnInit {
    departments: DepartmentModel[] = [];
    pages: PageModel[] = [];
    selectedDepartment: number;
    pagesForDepartmentConstant: PagesForDepartmentModel[] = [];
    pagesForDepartment: PagesForDepartmentModel[] = [];
    items: Array<KeyValue> = [];
    date: Date = new Date();
    pagePermissionModelToSave : PagePermissionModel[]=[];

    constructor(private pageService: PageService,
        private pagePermissionService: PagePermissionService,
        private departmentService: DepartmentService) { };

    getDepartments(): void {
        this.departmentService.GetAll()
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                this.departments = response.Records;
                for (let department of this.departments) {
                    this.items.push(new KeyValue(department.DepartmentName, department.DepartmentId));
                }
            });
    }

    SetAllSelectedToFalse(pagesForDepartmentModel: PagesForDepartmentModel[]): any {
        for (let item of pagesForDepartmentModel) {
            item.AllowView = false;
            item.OnlyForHod = false;
        }
        return pagesForDepartmentModel;
    }

    canViewd(item: PagesForDepartmentModel) {
        return (item.AllowView == true || item.OnlyForHod== true);
    };

      save(): void {
        let model = this.pagesForDepartment.filter(this.canViewd);
        let selectedDepartment = this.selectedDepartment;
        let dateNow= this.date;
        this.pagePermissionModelToSave = model.map(function ( data) {
            {
                let item = new PagePermissionModel();
                item.PermissionId = 0;
                item.DepartmentId = selectedDepartment;
                //item.EmergencyTypeId=this.selectedEmergencyType;
                item.PageId = data.PageId;
                item.CanView= data.AllowView;
                item.OnlyHOD= data.OnlyForHod;
                 item.ActiveFlag = 'Active';
                item.CreatedBy = 1;
                item.CreatedOn = dateNow;
                return item;
            }
        });
        this.pagePermissionService.CreateBulk(this.pagePermissionModelToSave)
            .subscribe((response: PagePermissionModel[]) => {
                // this.dataExchange.Publish("demandTypeModelSaved", response);
                console.log("Success");
            }, (error: any) => {
                console.log(error);
            });
    };

    onNotify(message: KeyValue): void {
        this.selectedDepartment = message.Value;
        this.pagePermissionService.GetFilter(message.Value.toString())
            .subscribe((response: ResponseModel<PagePermissionModel>) => {
                this.pagesForDepartment = this.SetAllSelectedToFalse(this.pagesForDepartmentConstant);
                console.log(this.pagesForDepartment);
                for (let item2 of this.pagesForDepartment) {
                    if (response.Count != 0) {
                        for (let model of response.Records) {
                            if (item2.PageId == model.PageId) {
                                item2.AllowView = true;
                                item2.OnlyForHod = model.OnlyHOD;
                            }
                        }
                    }
                }
            });
    }

    ngOnInit(): any {
        this.getDepartments();
        this.pageService.GetAll()
            .subscribe((response: ResponseModel<PageModel>) => {
                this.pages = response.Records;
                for (let page of this.pages) {
                    let item1 = new PagesForDepartmentModel();
                    item1.PageId = page.PageId;
                    item1.PageName = page.PageName;
                    item1.AllowView = false;
                    item1.OnlyForHod = false;
                    this.pagesForDepartmentConstant.push(item1);
                }
            });
    }
}