import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { BroadCastDepartmentModel } from './broadcast.department.model';
import { BroadcastDepartmentService } from './broadcast.department.service';
import { ResponseModel, DataExchangeService } from '../../../../shared';

@Component({
    selector: 'broadcastDepartment-detail',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/broadcast.department.list.view.html'
})
export class BroadCastDepartmentListComponent implements OnInit {
    @Input() initiatedDepartmentId: string;

    BroadCastDepartments: BroadCastDepartmentModel[] = [];

    /**
     * Creates an instance of BroadCastDepartmentListComponent.
     * @param {BroadcastDepartmentService} broadCastDepartmentService
     * @param {DataExchangeService<BroadCastDepartmentModel>} dataExchange
     *
     * @memberOf BroadCastDepartmentListComponent
     */
    constructor(private broadCastDepartmentService: BroadcastDepartmentService,
        private dataExchange: DataExchangeService<BroadCastDepartmentModel>) { }

    getBroadCastDepartmentMappings(): void {
        this.broadCastDepartmentService.Query(+this.initiatedDepartmentId)
            .subscribe((response: ResponseModel<BroadCastDepartmentModel>) => {
                this.BroadCastDepartments = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    ngOnInit(): void {
        this.getBroadCastDepartmentMappings();
    }
}