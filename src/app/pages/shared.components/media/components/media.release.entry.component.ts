import {
    Component, ViewEncapsulation, OnDestroy,
    Output, EventEmitter, OnInit, Input
} from '@angular/core';
import {
    ReactiveFormsModule, FormGroup, FormControl,
    FormBuilder, AbstractControl, Validators
} from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';


import { MediaService } from './media.service';
import { MediaModel } from './media.model';
import {
    ResponseModel, UtilityService, KeyValue,
    DataExchangeService, GlobalConstants, GlobalStateService, AuthModel
} from '../../../../shared';


@Component({
    selector: 'mediaRelease-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.release.entry.view.html'
})
export class MediaReleaseEntryComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: string;
    @Input() incidentId: string;

    public form: FormGroup;
    media: MediaModel = new MediaModel();
    date: Date = new Date();
    Action: string;
    currentIncidentId: number;
    currentDepartmentId: number;
    showAdd: boolean;
    credential: AuthModel;

    /**
     * Creates an instance of MediaQueryEntryComponent.
     * @param {MediaQueryService} mediaQueryService 
     * @param {DataExchangeService<MediaQueryModel>} dataExchange 
     * @param {FormBuilder} builder 
     * 
     * @memberOf MediaQueryEntryComponent
     */
    constructor(private mediaQueryService: MediaService,
        private dataExchange: DataExchangeService<MediaModel>,
        private globalState: GlobalStateService,
        private builder: FormBuilder,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) {
        this.showAdd = false;
    }

    ngOnInit(): void {
        this.currentIncidentId = +this.currentIncidentId;
        this.currentDepartmentId = +this.initiatedDepartmentId;
        this.formInit();
        this.credential = UtilityService.getCredentialDetails();
        this.dataExchange.Subscribe("OnMediaReleaseUpdate", model => this.onMediaReleaseUpdate(model));
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    }
    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("OnMediaReleaseUpdate");
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }

    onMediaReleaseUpdate(mediaModel: MediaModel): void {
        this.media = mediaModel;
        this.media.MediaqueryId = mediaModel.MediaqueryId;
        this.media.IsUpdated = true;
        this.Action = "Edit";
        this.showAdd = true;
    }

    save(): void {
        if (this.form.valid) {
            this.media.IsPublished = false;
            this.Action = "Save";
            this.CreateOrUpdateMediaQuery();
        }
    }

    publish(): void {
        if (this.form.valid) {
            this.media.IsPublished = true;
            this.media.PublishedBy = 1;
            this.media.PublishedOn = this.date;
            this.Action = "Publish";
            this.CreateOrUpdateMediaQuery();
        }
    }

    private CreateOrUpdateMediaQuery(): void {
        UtilityService.setModelFromFormGroup<MediaModel>
            (this.media, this.form, x => x.Message, x => x.Remarks);

        this.media.IncidentId = this.currentIncidentId;
        this.media.InitiateDepartmentId = this.currentDepartmentId;

        if (this.media.MediaqueryId == 0) {
            this.media.CreatedBy = +this.credential.UserId;
            this.mediaQueryService.Create(this.media)
                .subscribe((response: MediaModel) => {
                    this.toastrService.success('Media release Saved successfully.', 'Success', this.toastrConfig);
                    this.dataExchange.Publish("MediaModelSaved", response);
                    this.showAdd = false;
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
            this.mediaQueryService.Update(this.media)
                .subscribe((response: MediaModel) => {
                    this.toastrService.success('Media release edited successfully.', 'Success', this.toastrConfig);
                    this.dataExchange.Publish("MediaModelUpdated", response);
                    this.showAdd = false;
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
    }

    cancel(): void {
        this.formInit();
        this.showAdd = false
    }

    private formInit(): void {
        this.form = new FormGroup({
            MediaqueryId: new FormControl(0),
            Message: new FormControl('', [Validators.required, Validators.maxLength(500)]),
            Remarks: new FormControl('', [Validators.required, Validators.maxLength(500)])
        });

        this.media = new MediaModel();
        this.Action = "Save";
    }

    showAddRegion(ShowAdd: Boolean): void {
        this.showAdd = true;
    };
}