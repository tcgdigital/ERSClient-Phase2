import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ToastrService, ToastrConfig } from 'ngx-toastr';


import { DepartmentService, DepartmentModel } from '../department';
import { UserProfileService, UserProfileModel } from '../userprofile';
import { UserPermissionService } from './components/userpermission.service';
import { UserPermissionModel, DepartmentsToView } from './components/userpermission.model';
import { ResponseModel, DataExchangeService, AutocompleteComponent, KeyValue } from '../../../shared';

@Component({
    selector: 'user-permission-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/userpermission.view.html',
    styleUrls:['./styles/userpermission.style.scss']
})
export class UserPermissionComponent {
    userProfileItems: UserProfileModel[] = [];
    departments: DepartmentModel[] = [];
    departmentsToView: DepartmentsToView[] = [];
    departmentsToViewConstant: DepartmentsToView[] = [];
    userPermissionModelToSave: UserPermissionModel[] = [];
    selectedUser: number;
    date: Date = new Date();
    private items: Array<KeyValue> = [];
    allSelectMember : boolean;
    allSelectHOD    : boolean;

    constructor(private userPermissionService: UserPermissionService,
        private userProfileService: UserProfileService,
        private departmentService: DepartmentService, private toastrService: ToastrService,
		private toastrConfig: ToastrConfig) { };

    getUserProfiles(): void {
        this.userProfileService.GetAll()
            .subscribe((response: ResponseModel<UserProfileModel>) => {
                this.userProfileItems = response.Records;
                this.userProfileItems.forEach(userProfile => {
                    this.items.push(new KeyValue(userProfile.Name, userProfile.UserProfileId));
                });
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    SetAllSelectedToFalse(departmentsToViewModel: DepartmentsToView[]): void {
        departmentsToViewModel.forEach(item => {
            item.IsMemberOf = false;
            item.IsHod = false;
        });
    }

    invokeReset(): void {
        this.departmentsToView = [];
        this.allSelectMember = false;
        this.allSelectHOD = false;
    }

    onNotify(message: KeyValue): void {
        this.selectedUser = message.Value;
        this.userPermissionService.GetFilterByUsers(message.Value)
            .subscribe((response: ResponseModel<UserPermissionModel>) => {
                this.SetAllSelectedToFalse(this.departmentsToViewConstant);
                this.departmentsToView = this.departmentsToViewConstant;

                this.departmentsToView.forEach(departmentToView => {
                    if (response.Count != 0) {
                        let userPermissionObject = response.Records
                            .find(x => {
                                return (x.DepartmentId == departmentToView.DepartmentId);
                            });
                            if(userPermissionObject){
                                departmentToView.IsHod = userPermissionObject.IsHod;
                                departmentToView.IsMemberOf = userPermissionObject.IsMemberOf;
                            }
                    }
                });
                this.checkAllStatusHod();
                this.checkAllStatusMember();
            }, (error: any) => {
                console.log(`Error: ${error}`);
                
            });
    };

    isHod(item: DepartmentsToView) {
        return item.IsHod == true;
    }

    isMemberOf(item: DepartmentsToView) {
        return item.IsMemberOf == true;
    }
    selectAllMember(value: any) : void{
        this.departmentsToView.forEach(x =>{
            x.IsMemberOf = value.checked;
            if(value.checked == false)
            {
                x.IsHod = value.checked;
                this.allSelectHOD = value.checked;
            }
        });       
    }
    selectAllHOD(value: any) : void{
        this.departmentsToView.forEach(x =>{
            x.IsHod = value.checked;
            if(value.checked == true)
            {
                x.IsMemberOf = true;
                this.allSelectMember = true;
            }
        });
    }
checkAllStatusHod(event: any = '', model: DepartmentsToView = null) : void {
    if(event != '' && model != null)
    {
        if(event.checked == true)
        {
            model.IsHod = true;
            model.IsMemberOf = true;
        }
        else
        {
            model.IsHod = false;
        }
    }
    this.allSelectHOD = this.departmentsToView.length != 0 && this.departmentsToView.filter(x=>{
        return (x.IsHod == true && x.IsMemberOf == true);
    }).length == this.departmentsToView.length;
}
checkAllStatusMember(event: any = '', model: DepartmentsToView = null) : void {
    if(event != '' && model != null)
    {
        if (event.checked == false)
        {
            model.IsMemberOf = false;
            model.IsHod = false;
            this.allSelectHOD = false;
        }
        else
        {
            model.IsMemberOf = true;
        }
    }
    this.allSelectMember = this.departmentsToView.length != 0 && this.departmentsToView.filter(x=>{
         return (x.IsMemberOf == true && x.IsHod == true);
    }).length == this.departmentsToView.length;
}
    save(): void {
        let model = this.departmentsToView.filter(this.isMemberOf);
        let selectedUser = this.selectedUser;
        let datenow = this.date;
        this.userPermissionModelToSave = model.map(function (data) {
            {
                let item = new UserPermissionModel();
                item.UserId = selectedUser;
                item.DepartmentId = data.DepartmentId;
                item.ActiveFlag = 'Active';
                item.CreatedBy = 1;
                item.CreatedOn = datenow;
                item.IsMemberOf = data.IsMemberOf;
                item.IsHod = data.IsHod;
                return item;
            }
        });
        if(this.userPermissionModelToSave.length > 0)
        {
            this.userPermissionService.CreateBulk(this.userPermissionModelToSave)
                .subscribe((response: UserPermissionModel[]) => {
                    this.toastrService.success('User permissions saved Successfully.', 'Success', this.toastrConfig);
                    console.log("Success");
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else
        {
            this.toastrService.error('User must be mapped with at least one department!', 'Error', this.toastrConfig);
        }
    }

    ngOnInit(): any {
        this.allSelectMember=false;
        this.allSelectHOD=false;
        this.getUserProfiles();
        this.departmentService.GetAll()
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                this.departments = response.Records;
                this.departmentsToViewConstant=this.userPermissionService
                .CreateDefaultDepartmentList(this.departments);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }
}