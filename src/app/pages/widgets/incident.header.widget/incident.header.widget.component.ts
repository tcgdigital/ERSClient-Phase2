import {
    Component, OnInit, Input,
    Output, EventEmitter, ViewEncapsulation,
    OnChanges, SimpleChange, OnDestroy
} from '@angular/core';
import {
    KeyValue, UtilityService, GlobalStateService,
    ResponseModel,
    GlobalConstants
} from '../../../shared';
import { IncidentModel, IncidentService } from '../../incident/components';
import { DepartmentService, DepartmentModel } from "../../masterdata/department";
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'incident-header-widget',
    templateUrl: './incident.header.widget.view.html',
    styleUrls: ['./incident.header.widget.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class IncidentHeaderWidgetComponent implements OnInit, OnChanges, OnDestroy {
    @Input() currentIncident: KeyValue;
    @Input() currentDepartment: KeyValue;
    @Input() isShowViewReadonlyCrisis: KeyValue;

    @Output() viewIncidentHandler: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();

    incidentName: string = '';
    departmentName: string = '';
    public useLink: boolean;
    //public isShowViewReadonlyCrisis: boolean = true;
    public currentDepartmentId: number = 0;
    public IsDrillIndicator: boolean = false;
    private incidentId: number;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private globalState: GlobalStateService,
        private incidentService: IncidentService,
        private departmentService: DepartmentService) { }

    ngOnInit() {
        this.useLink = true;
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange,
            (model: KeyValue) => this.departmentChangeHandler(model));
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.incidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        // this.getIncident(this.currentIncident.Value);
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    getIncident(incidentId: number): void {
        this.incidentService.GetIncidentById(incidentId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((item: IncidentModel) => {
                this.IsDrillIndicator = item.IsDrill;
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    getDepartment(departmentId: number): void {
        this.departmentService.GetDepartmentById(departmentId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((item: ResponseModel<DepartmentModel>) => {
                this.currentDepartment.Key = item.Records[0].DepartmentName;
                this.departmentName = item.Records[0].Description;
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        if (this.currentIncident !== undefined) {
            this.incidentName = this.currentIncident.Key;
            this.getIncident(this.currentIncident.Value);
        }
        if (this.currentDepartment !== undefined) {
            this.getDepartment(this.currentDepartment.Value);
        }
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
    }
}