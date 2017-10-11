import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DepartmentModel } from './department.model';
import { DepartmentService } from './department.service';
import { UserProfileService } from '../../userprofile';
import {
    ResponseModel, SearchConfigModel,
    SearchTextBox, SearchDropdown,
    NameValue, DataExchangeService
} from '../../../../shared';

@Component({
    selector: 'dept-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/department.list.view.html',
    styleUrls: ['../styles/department.style.scss']
})
export class DepartmentListComponent implements OnInit {
    departments: DepartmentModel[] = [];
    searchConfigs: Array<SearchConfigModel<any>> = Array<SearchConfigModel<any>>();
    departmentIds: number[] = [];
    departmentModelPatch: DepartmentModel = null;
    expandSearch: boolean = false;
    searchValue: string = "Expand Search";

    constructor(private departmentService: DepartmentService, private dataExchange: DataExchangeService<DepartmentModel>,
        private userProfileService: UserProfileService) {
    }

    getDepertments(): void {
        this.departmentService.GetAll()
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                response.Records.forEach((x) => {
                    x['Active'] = (x.ActiveFlag === 'Active');
                    this.departmentIds.push(x.DepartmentId);
                });
                this.departments = response.Records;
            }, ((error: any) => {
                console.log(`Error: ${error}`);
            }));
    }

    expandSearchPanel(value): void {
        if (!value) {
            this.searchValue = "Hide Search Panel";
        }
        else {
            this.searchValue = "Expand Search Panel";
        }
        this.expandSearch = !this.expandSearch;
    }

    ngOnInit(): any {
        this.getDepertments();
        this.initiateSearchConfigurations();
        this.dataExchange.Subscribe('departmentSavedOrEdited',
            (model) => this.onDepartmentEditorSaveSuccess(model));
    }

    onDepartmentEditorSaveSuccess(model?: DepartmentModel): void {
        this.getDepertments();
        this.initiateSearchConfigurations();
    }

    editdepartment(editedDepartment): void {
        this.dataExchange.Publish('departmentModelEdited', editedDepartment);
    }

    IsActive(event: any, editeddepartment: DepartmentModel): void {
        this.departmentModelPatch = new DepartmentModel();
        this.departmentModelPatch.DepartmentId = editeddepartment.DepartmentId;
        this.departmentModelPatch.deleteAttributes();
        this.departmentModelPatch.ActiveFlag = 'Active';
        if (!event.checked) {
            this.departmentModelPatch.ActiveFlag = 'InActive';
        }
        this.departmentService.Update(this.departmentModelPatch)
            .subscribe((response: DepartmentModel) => {
                this.getDepertments();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    invokeSearch(query: string): void {
        if (query !== '') {
            this.departmentService.GetQuery(query)
                .subscribe((response: ResponseModel<DepartmentModel>) => {
                    response.Records.forEach((x) => {
                        x['Active'] = (x.ActiveFlag === 'Active');
                        this.departmentIds.push(x.DepartmentId);
                    });
                    this.departments = response.Records;
                }, ((error: any) => {
                    console.log(`Error: ${error}`);
                }));
        }
        else {
            this.getDepertments();
        }
    }

    invokeReset(): void {
        this.getDepertments();
    }

    private initiateSearchConfigurations(): void {
        const status: Array<NameValue<string>> = [
            new NameValue<string>('Active', 'Active'),
            new NameValue<string>('InActive', 'InActive'),
        ];

        this.searchConfigs = [
            new SearchTextBox({
                Name: 'DepartmentName',
                Description: 'Department Code',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'Description',
                Description: 'Department Name',
                Value: ''
            }),
            new SearchDropdown({
                Name: 'ParentDepartmentId',
                Description: 'Parent Department',
                PlaceHolder: 'Select Parent Department',
                Value: '',
                ListData: this.departmentService.GetParentDepartments()
                    .map((x) => x.Records)
                    .map((x) => {
                        const parentDepartments: Array<NameValue<number>> = Array<NameValue<number>>();
                        x.forEach((y) => {
                            if (parentDepartments.find((z) => z.Value === y.ParentDepartment.DepartmentId) == null) {
                                parentDepartments.push(new NameValue<number>(y.ParentDepartment.DepartmentName, y.ParentDepartmentId));
                            }
                        });
                        return parentDepartments;
                    })
            }),
            new SearchDropdown({
                Name: 'DepartmentSpoc',
                Description: 'Department SPOC',
                PlaceHolder: 'Select Department SPOC',
                Value: '',
                ListData: this.userProfileService.GetAllActiveWithContact()
                    .map((x) => x.Records.map((y) => new NameValue<number>(y.Name, y.UserProfileId)))
                // .map((x) => x.map((y) => new NameValue<number>(y.Name, y.UserProfileId)))
            }),
            new SearchDropdown({
                Name: 'ActiveFlag',
                Description: 'Status',
                PlaceHolder: 'Select Status',
                Value: '',
                ListData: Observable.of(status)
            }),
            new SearchTextBox({
                Name: 'ContactNo',
                Description: 'Contact Number',
                Value: '',
            })
        ];
    }
}