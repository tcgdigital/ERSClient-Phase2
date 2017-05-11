import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ToastrService, ToastrConfig } from 'ngx-toastr';


import { DepartmentService, DepartmentModel } from '../department';
import { PageService, PagePermissionService } from './components';
import {
    PageModel, PagePermissionModel,
    PagesForDepartmentModel
} from './components/department.functionality.model';
import {
    DataExchangeService, ResponseModel,
    AutocompleteComponent, KeyValue, AuthModel, UtilityService
} from '../../../shared';


@Component({
    selector: 'department-functionality',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/department.functionality.view.html',
    styleUrls: ['./styles/department.functionality.style.scss']
})
export class DepartmentFunctionalityComponent implements OnInit {
    departments: DepartmentModel[] = [];
    pages: PageModel[] = [];
    selectedDepartment: number;
    pagesForDepartmentConstant: PagesForDepartmentModel[] = [];
    pagesForDepartment: PagesForDepartmentModel[] = [];
    items: Array<KeyValue> = [];
    date: Date = new Date();
    pagePermissionModelToSave: PagePermissionModel[] = [];
    credential: AuthModel;
    allSelectView : boolean;
    allSelectOnlyHOD : boolean;

    constructor(private pageService: PageService,
        private pagePermissionService: PagePermissionService,
        private departmentService: DepartmentService, private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) { };

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
        return (item.AllowView == true || item.OnlyForHod == true);
    };

    isValidView(item: PagesForDepartmentModel) {
        return (item.AllowView == true );
    };

    isValidOnlyForHOD(item: PagesForDepartmentModel) {
        return (item.OnlyForHod == true);
    };

    

    save(): void {
        let model = this.pagesForDepartment.filter(this.canViewd);
        let selectedDepartment = this.selectedDepartment;
        let dateNow = this.date;
        let userId = +this.credential.UserId;
        this.pagePermissionModelToSave = model.map(function (data) {
            {
                let item = new PagePermissionModel();
                item.PermissionId = 0;
                item.DepartmentId = selectedDepartment;
                //item.EmergencyTypeId=this.selectedEmergencyType;
                item.PageId = data.PageId;
                item.CanView = data.AllowView;
                item.OnlyHOD = data.OnlyForHod;
                item.ActiveFlag = 'Active';
                item.CreatedBy = userId;
                item.CreatedOn = dateNow;
                return item;
            }
        });
        this.pagePermissionService.CreateBulk(this.pagePermissionModelToSave)
            .subscribe((response: PagePermissionModel[]) => {
                this.toastrService.success('Department Funtionality saved Successfully.', 'Success', this.toastrConfig);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    onNotify(message: KeyValue): void {
        this.selectedDepartment = message.Value;
        this.pagePermissionService.GetFilter(message.Value.toString())
            .subscribe((response: ResponseModel<PagePermissionModel>) => {
                this.pagesForDepartment = this.SetAllSelectedToFalse(this.pagesForDepartmentConstant);
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
                this.checkAllStatusView();
                this.checkAllStatusOnlyHOD();
            });
    }
     selectAllDeptView(value: any) : void{
        if(value.checked)
        {
            this.pagesForDepartment.forEach(x =>{
                x.AllowView = true;
            });
        }
        else{
            this.pagesForDepartment.forEach(x =>{
                x.AllowView = false;
            });
        }

    }
   selectAllDeptOnlyHOD(value: any) : void{
        if(value.checked)
        {
            this.pagesForDepartment.forEach(x =>{
                x.OnlyForHod = true;
            });
        }
        else{
            this.pagesForDepartment.forEach(x =>{
                x.OnlyForHod = false;
            });
        }

    } 
    checkAllStatusView() : void{
      if(this.pagesForDepartment.filter(this.isValidView).length == this.pagesForDepartment.length){
          this.allSelectView=true;
      }
      else{
          this.allSelectView=false;
      }
    }
    checkAllStatusOnlyHOD() : void{
      if(this.pagesForDepartment.filter(this.isValidOnlyForHOD).length == this.pagesForDepartment.length){
          this.allSelectOnlyHOD=true;
      }
      else{
          this.allSelectOnlyHOD=false;
      }
    }
    invokeReset(): void {
        this.pagesForDepartment = [];
        this.allSelectView = false;
        this.allSelectOnlyHOD = false;
    }

    ngOnInit(): any {
        this.allSelectView=false;
        this.allSelectOnlyHOD=false;
        this.getDepartments();
        this.credential = UtilityService.getCredentialDetails();
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