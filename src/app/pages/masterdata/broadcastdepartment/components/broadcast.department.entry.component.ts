import { Component, ViewEncapsulation, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { BroadcastDepartmentService } from './broadcast.department.service';
import { BroadCastDepartmentModel } from './broadcast.department.model';
import { ResponseModel, DataExchangeService, GlobalConstants } from '../../../../shared';

@Component({
    selector: 'broadcastDepartment-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/broadcast.department.entry.view.html'
})
export class BroadcastDepartmentEntryComponent implements OnInit {
    @Input() initiatedDepartmentId: string;
    @Input() currentIncidentId: string;

    public form: FormGroup;
    BroadCastDepartmentMappings: BroadCastDepartmentModel = new BroadCastDepartmentModel();
    date: Date = new Date();
    precidentMessages: BroadCastDepartmentModel[] = [];
    Action: string;

    constructor(private broadcastDepartmentService: BroadcastDepartmentService,
        private dataExchange: DataExchangeService<BroadCastDepartmentModel>,
        private builder: FormBuilder) { }

    ngOnInit(): void { }
}