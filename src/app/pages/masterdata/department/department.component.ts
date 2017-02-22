import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { DepartmentService } from './components/department.service';

@Component({
    selector: 'dept-main',
    encapsulation: ViewEncapsulation.None,
    providers: [DepartmentService],
    templateUrl: './views/department.view.html'
})
export class DepartmentComponent implements OnInit {
    public data: any;

    constructor(private departmentService: DepartmentService) { }

    ngOnInit() {
        // this.departmentService.BatchOperation()
        //     .subscribe((data) => {
        //         this.data = data;
        //         console.log(data);
        //     });
    }
}