import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { DepartmentModel } from './department.model';
import { DepartmentService } from './department.service';
import { ResponseModel } from '../../../../shared';

@Component({
    selector: 'dept-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/department.list.view.html',
    styleUrls: ['../styles/department.style.scss']
})
export class DepartmentListComponent implements OnInit {
    departments: DepartmentModel[] = [];

    constructor(private departmentService: DepartmentService) { }

    getDepertments(): void {
        this.departmentService.GetAll()
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                this.departments = response.Records;
            }, ((error: any) => {
                console.log(error);
            }));
    }

    ngOnInit(): any {
        this.getDepertments();
    }
}