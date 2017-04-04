import {
    Component, ViewEncapsulation,
    Output, Input, EventEmitter
} from '@angular/core';
import { GlobalStateService } from '../../services';
import { KeyValue } from '../../models';

@Component({
    selector: '[page-header]',
    templateUrl: './page.header.view.html',
    encapsulation: ViewEncapsulation.None
})
export class PageHeaderComponent {
    @Input() departments: KeyValue[];
    @Input() incidents: KeyValue[];

    @Output() toggleSideMenu: EventEmitter<any> = new EventEmitter<any>();
    @Output() contactClicked: EventEmitter<any> = new EventEmitter<any>();
    @Output() helpClicked: EventEmitter<any> = new EventEmitter<any>();
    
    @Output() departmentChange: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();
    @Output() incidentChange: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();

    public onToggleSideMenu($event): void {
        this.toggleSideMenu.emit($event);
    }

    public onContactClicked($event): void {
        this.contactClicked.emit($event);
    }

    public onHelpClicked($event): void {
        this.helpClicked.emit($event);
    }

    public onDepartmentChange(selectedDepartment: KeyValue): void {
        this.departmentChange.emit(selectedDepartment);
    }

    public onIncidentChange(selectedIncident: KeyValue): void {
        this.incidentChange.emit(selectedIncident);
    }
}