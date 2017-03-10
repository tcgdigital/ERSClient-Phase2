import {
    Component, ViewEncapsulation, OnDestroy,
    Output, EventEmitter, OnInit, Input
} from '@angular/core';
import {
    ReactiveFormsModule, FormGroup, FormControl,
    FormBuilder, AbstractControl, Validators
} from '@angular/forms';

import { MediaService } from './media.service';
import { MediaModel } from './media.model';
import {
    ResponseModel, UtilityService,
    DataExchangeService, GlobalConstants
} from '../../../../shared';


@Component({
    selector: 'mediaRelease-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.release.entry.view.html'
})
export class MediaReleaseEntryComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: string;
    @Input() currentIncidentId: string;

    public form: FormGroup;
    media: MediaModel;
    date: Date = new Date();
    // medias: MediaModel[] = [];
    Action: string;

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
        private builder: FormBuilder) { }

    ngOnInit(): void {
        this.formInit();
        this.dataExchange.Subscribe("OnMediaReleaseUpdate", model => this.onMediaReleaseUpdate(model))
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("OnMediaReleaseUpdate");
    }

    onMediaReleaseUpdate(mediaModel: MediaModel): void {
        this.media = mediaModel;
        this.media.MediaqueryId = mediaModel.MediaqueryId;
        this.media.IncidentId = +this.currentIncidentId;
        this.media.InitiateDepartmentId = +this.initiatedDepartmentId;
        this.media.IsUpdated = true;
        this.Action = "Edit";
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

        if (this.media.MediaqueryId == 0) {
            this.media.MediaqueryId = this.form.controls["MediaqueryId"].value;

            this.mediaQueryService.Create(this.media)
                .subscribe((response: MediaModel) => {
                    this.dataExchange.Publish("MediaModelSaved", response);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
            this.mediaQueryService.Update(this.media)
                .subscribe((response: MediaModel) => {
                    this.dataExchange.Publish("MediaModelUpdated", response);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
    }

    cancel(): void {
        this.formInit();
    }

    private formInit(): void {
        this.form = new FormGroup({
            MediaqueryId: new FormControl(0),
            Message: new FormControl('', [Validators.required, Validators.maxLength(500)]),
            Remarks: new FormControl('', [Validators.required, Validators.maxLength(500)])
        });

        this.media = new MediaModel();
        this.media.IncidentId = +this.currentIncidentId;
        this.media.InitiateDepartmentId = +this.initiatedDepartmentId;
        this.Action = "Save";
    }
}