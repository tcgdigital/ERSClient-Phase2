import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DepartmentModel } from './department.model';
import { DepartmentService } from './department.service';
import { UserProfileService } from '../../userprofile';
import {
    ResponseModel, SearchConfigModel,
    SearchTextBox, SearchDropdown,
    NameValue
} from '../../../../shared';

@Component({
    selector: 'dept-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/department.list.view.html',
    styleUrls: ['../styles/department.style.scss']
})
export class DepartmentListComponent implements OnInit {
    departments: DepartmentModel[] = [];
    searchConfigs: SearchConfigModel<any>[] = [];

    constructor(private departmentService: DepartmentService,
        private userProfileService: UserProfileService) {
    }

    getDepertments(): void {
        this.departmentService.GetAll()
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                this.departments = response.Records;
            }, ((error: any) => {
                console.log(`Error: ${error}`);
            }));
    }

    ngOnInit(): any {
        this.getDepertments();
        this.initiateSearchConfigurations();
    }

    invokeSearch(query: string): void {
        if (query !== '') {
            this.departmentService.GetQuery(query)
                .subscribe((response: ResponseModel<DepartmentModel>) => {
                    this.departments = response.Records;
                }, ((error: any) => {
                    console.log(`Error: ${error}`);
                }));
        }
    }

    invokeReset(): void {
        this.getDepertments();
    }

    private initiateSearchConfigurations(): void {
        let status: NameValue<string>[] = [
            new NameValue<string>('Active', 'Active'),
            new NameValue<string>('In-Active', 'In-Active'),
        ]
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
                ListData: this.departmentService.GetAll()
                    .map(x => x.Records)
                    .map(x => x.map(y => new NameValue<number>(y.DepartmentName, y.DepartmentId)))
            }),
            new SearchDropdown({
                Name: 'DepartmentSpoc',
                Description: 'Department SPOC',
                PlaceHolder: 'Select Department SPOC',
                Value: '',
                ListData: this.userProfileService.GetAll()
                    .map(x => x.Records)
                    .map(x => x.map(y => new NameValue<number>(`${y.Name} (${y.MainContact})`, y.UserProfileId)))
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