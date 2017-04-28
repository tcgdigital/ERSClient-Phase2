import {
    Component, ViewEncapsulation, Input,
    OnInit, OnDestroy, AfterContentInit, ViewChild
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    AbstractControl, Validators, ReactiveFormsModule
} from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import {
    ResponseModel, DataExchangeService, KeyValue,
    UtilityService, GlobalConstants, GlobalStateService,
    FileUploadService
} from '../../shared';
import { FileData } from '../../shared/models';

@Component({
    selector: 'masterdataupload-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/masterdata.upload.view.html'
})

export class MasterDataUploadComponent{   
    constructor(private globalState: GlobalStateService) { }
    @Input() DepartmentId: number;
    @Input() IncidentId: number;
    
    public ngOnInit(): void {
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    public ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }

     private incidentChangeHandler(incident: KeyValue): void {
        this.IncidentId = incident.Value;
    };

    private departmentChangeHandler(department: KeyValue): void {
        this.DepartmentId = department.Value;
    };
}