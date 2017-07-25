import {
    Component, OnInit, Input,
    Output, EventEmitter, ViewEncapsulation,
    OnChanges, SimpleChange
} from '@angular/core';
import { KeyValue, UtilityService, GlobalStateService } from '../../../shared';

@Component({
    selector: 'incident-header-widget',
    templateUrl: './incident.header.widget.view.html',
    styleUrls: ['./incident.header.widget.style.scss'],
    encapsulation: ViewEncapsulation.None
})

export class IncidentHeaderWidgetComponent implements OnInit, OnChanges {
    @Input() currentIncident: KeyValue;
    @Input() currentDepartment: KeyValue;
    @Input() isShowViewReadonlyCrisis: KeyValue;

    @Output() viewIncidentHandler: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();

    incidentName: string = '';
    departmentName: string = '';
    public useLink: boolean;
    //public isShowViewReadonlyCrisis: boolean = true;
    public currentDepartmentId: number = 0;

    constructor(private globalState: GlobalStateService) { }

    ngOnInit() {

        this.useLink = true;
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
    }

    // public onViewIncidentClick(): void {
    //     this.viewIncidentHandler.emit(this.currentIncident);
    // }

    public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        if (this.currentIncident !== undefined) {
            this.incidentName = this.currentIncident.Key;
        }
        if (this.currentDepartment !== undefined) {
            this.departmentName = this.currentDepartment.Key;
        }
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;

    }
}