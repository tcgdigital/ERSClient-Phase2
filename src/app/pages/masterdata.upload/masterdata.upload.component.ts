import {
    Component, ViewEncapsulation, Input
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators, ReactiveFormsModule
} from '@angular/forms';
import {
    KeyValue, UtilityService, GlobalConstants, GlobalStateService
} from '../../shared';

@Component({
    selector: 'masterdataupload-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/masterdata.upload.view.html'
})
export class MasterDataUploadComponent {
    constructor(private globalState: GlobalStateService) { }
    @Input() DepartmentId: number;
    @Input() IncidentId: number;

    public isShowPage: boolean = true;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;

    public ngOnInit(): void {
        this.IncidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.DepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChange,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange,
            (model: KeyValue) => this.departmentChangeHandler(model));
    }

    public ngOnDestroy(): void {
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChange);
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.DepartmentChange);
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.IncidentId = incident.Value;
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.DepartmentId = department.Value;
    }
}