import { Component, ViewEncapsulation, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BroadcastDepartmentService } from './broadcast.department.service';
import { BroadCastDepartmentModel } from './broadcast.department.model';
import { DataExchangeService } from '../../../../shared';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'broadcastDepartment-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/broadcast.department.entry.view.html'
})
export class BroadcastDepartmentEntryComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: string;
    @Input() currentIncidentId: string;

    public form: FormGroup;
    BroadCastDepartmentMappings: BroadCastDepartmentModel = new BroadCastDepartmentModel();
    date: Date = new Date();
    precidentMessages: BroadCastDepartmentModel[] = [];
    Action: string;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     *Creates an instance of BroadcastDepartmentEntryComponent.
     * @param {BroadcastDepartmentService} broadcastDepartmentService
     * @param {DataExchangeService<BroadCastDepartmentModel>} dataExchange
     * @param {FormBuilder} builder
     * @memberof BroadcastDepartmentEntryComponent
     */
    constructor(private broadcastDepartmentService: BroadcastDepartmentService,
        private dataExchange: DataExchangeService<BroadCastDepartmentModel>,
        private builder: FormBuilder) { }

    ngOnInit(): void { }

    ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}