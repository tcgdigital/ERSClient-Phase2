import {
    Component, ViewEncapsulation, OnInit,
    Input, Output, EventEmitter, SimpleChange
} from '@angular/core';
import { KeyValue } from '../../models/base.model';
import { UtilityService } from '../../services/common.service/utility.service';

@Component({
    selector: '[command-header]',
    templateUrl: './command.header.view.html',
    styleUrls: ['./command.header.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CommandHeaderComponent implements OnInit {
    @Input() departments: KeyValue[];
    @Input() incidents: KeyValue[];
    @Input() currentDepartmentId: number = 0;
    @Input() currentIncidentId: number = 0;

    @Output() departmentChange: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();
    @Output() incidentChange: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();

    incidentPlaceholder: string = 'Incident';
    departmentPlaceholder: string = 'Department';
    clientName: string;

    constructor() {}

    public ngOnInit(): void {
        if (UtilityService.licenseInfo)
            this.clientName = UtilityService.licenseInfo.ClientName;
        else
            this.clientName = UtilityService.GetFromSession('ClientName');
    }

    public onDepartmentChange(selectedDepartment: KeyValue): void {
        this.departmentChange.emit(selectedDepartment);
    }

    public onIncidentChange(selectedIncident: KeyValue): void {
        this.incidentChange.emit(selectedIncident);
    }
