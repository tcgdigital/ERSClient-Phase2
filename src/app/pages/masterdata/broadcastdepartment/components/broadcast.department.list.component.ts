import { Component, OnInit, OnDestroy, ViewEncapsulation, Input } from '@angular/core';
import { BroadCastDepartmentModel } from './broadcast.department.model';
import { BroadcastDepartmentService } from './broadcast.department.service';
import { ResponseModel, DataExchangeService } from '../../../../shared';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'broadcastDepartment-detail',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/broadcast.department.list.view.html'
})
export class BroadCastDepartmentListComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: string;

    BroadCastDepartments: BroadCastDepartmentModel[] = [];
    private ngUnsubscribe: Subject<any> = new Subject<any>();

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
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<BroadCastDepartmentModel>) => {
                this.BroadCastDepartments = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    ngOnInit(): void {
        this.getBroadCastDepartmentMappings();
    }

    ngOnDestroy(): void {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}