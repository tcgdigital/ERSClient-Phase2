import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KeyValue } from '../../../shared/models';

@Component({
    selector: 'incident-header-widget',
    templateUrl: './incident.header.widget.view.html',
    styleUrls: ['./incident.header.widget.style.scss']
})

export class NameComponent implements OnInit {
    @Input() currentIncident: KeyValue;
    @Input() currentDepartment: KeyValue;

    @Output() viewIncidentHandler: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();

    constructor() { }

    ngOnInit() { }

    public onViewIncidentClick(): void {
        this.viewIncidentHandler.emit(this.currentIncident);
    }
}