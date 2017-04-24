import {
    Component, OnInit, Input,
    Output, EventEmitter, ViewEncapsulation,
    OnChanges, SimpleChange
} from '@angular/core';
import { KeyValue } from '../../../shared/models';

@Component({
    selector: 'incident-header-widget',
    templateUrl: './incident.header.widget.view.html',
    styleUrls: ['./incident.header.widget.style.scss'],
    encapsulation: ViewEncapsulation.None
})

export class IncidentHeaderWidgetComponent implements OnInit, OnChanges {
    @Input() currentIncident: KeyValue;
    @Input() currentDepartment: KeyValue;

    @Output() viewIncidentHandler: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();

    incidentName: string = '';
    departmentName: string = '';

    constructor() { }

    ngOnInit() { }

    public onViewIncidentClick(): void {
        this.viewIncidentHandler.emit(this.currentIncident);
    }

    public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        if(this.currentIncident !== undefined){
            this.incidentName = this.currentIncident.Key;
        }
        if(this.currentDepartment !== undefined){
            this.departmentName = this.currentDepartment.Key;
        }
    }
}