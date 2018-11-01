import {
    Component, ViewEncapsulation, OnDestroy, OnInit, Input
} from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder, Validators
} from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

import { MediaService } from './media.service';
import { MediaModel } from './media.model';
import {
    ResponseModel, UtilityService, KeyValue,
    DataExchangeService, GlobalConstants, GlobalStateService, AuthModel
} from '../../../../shared';

import { TemplateMediaModel, TemplateMediaService } from '../../template.media/components';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'mediaRelease-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.release.entry.view.html'
})
export class MediaReleaseEntryComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: number;
    @Input() incidentId: number;

    public form: FormGroup;
    media: MediaModel = new MediaModel();
    date: Date = new Date();
    Action: string;
    currentIncidentId: number;
    currentDepartmentId: number;
    showAdd: boolean;
    credential: AuthModel;
    hideMessageError: boolean = true;
    hideRemarksError: boolean = true;
    templateMedias: TemplateMediaModel[] = [];
    templateContent: string;
    currentTemplateMediaId: string;
    applyReadOnlytextBox: boolean = false;
    applyReadOnlyButtons: boolean = false;
    appReadOnlyPublish: boolean = true;
    isInvalidForm: boolean = false;
    isApprovedContent: boolean = false;
    isSavedContent: boolean = true;
    public isShowSndForApprvl: boolean = true;

    toolbarConfig: any = GlobalConstants.EditorToolbarConfig;
    toolbarConfigApproved: any = GlobalConstants.EditorToolbarConfig;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

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
        private toastrConfig: ToastrConfig,
        private templateMediaService: TemplateMediaService) {
        this.showAdd = false;
    }

    ngOnInit(): void {
        this.incidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.initiatedDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.initiatedDepartmentId;
        this.formInit();
        this.getTemplateMedias();
        this.isInvalidForm = false;
        this.credential = UtilityService.getCredentialDetails();

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.OnMediaReleaseUpdate,
            (model: MediaModel) => this.onMediaReleaseUpdate(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard,
            (model: KeyValue) => this.departmentChangeHandler(model));
    }


    ngOnDestroy(): void {
        //this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.OnMediaReleaseUpdate);
        //this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard);
        //this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    getTemplateMedias(): void {
        this.templateMediaService.GetAll()
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<TemplateMediaModel>) => {
                this.templateMedias = response.Records
                    .filter((a) => a.TemplateType === 'Media Release');
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    getContentFromTemplate(evt: any) {
        if (evt.target.value !== '') {
            const templateId = evt.target.value;
            //this.toolbarConfig['readOnly'] = false;
            this.mediaQueryService.GetContentFromTemplate(this.currentIncidentId, this.currentDepartmentId, +templateId)
                // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
                .takeUntil(this.ngUnsubscribe)
                .subscribe((response: any) => {
                    this.templateContent = `${response.Subject}${response.Body}`;
                    this.media.Message = this.templateContent;
                    this.applyReadOnlytextBox = false;
                }, (error: any) => {
                    console.log(`Error: ${error.message}`);
                });
        }
        else {
            this.media.Message = '';
            this.applyReadOnlytextBox = true;
        }
    }

    onMediaReleaseUpdate(mediaModel: MediaModel): void {

        this.currentTemplateMediaId = this.templateMedias
            .find((a) => a.TemplatePurpose === mediaModel.MediaReleaseType).TemplateMediaId.toString();

        if (mediaModel.MediaReleaseStatus === 'Approved' || mediaModel.MediaReleaseStatus === 'Published') {
            // this.isApprovedContent = true;
            // this.isSavedContent = false;
            this.media = new MediaModel();
            this.media = mediaModel;
            this.media.MediaqueryId = mediaModel.MediaqueryId;
            this.media.Message = this.media.ApprovedContent;
        }
        else {
            this.media = new MediaModel();
            this.media = mediaModel;
            this.media.MediaqueryId = mediaModel.MediaqueryId;
            this.media.IsUpdated = true;
        }

        if (this.media.MediaReleaseStatus === 'SentForApproval' || this.media.MediaReleaseStatus === 'Published') {
            this.form.controls['MediaReleaseType'].reset({ value: this.currentTemplateMediaId, disabled: true });
            this.applyReadOnlytextBox = true;
            this.applyReadOnlyButtons = true;
            this.appReadOnlyPublish = true;
            this.toolbarConfig['readOnly'] = true;
        }
        else if (this.media.MediaReleaseStatus === 'Approved') {
            this.appReadOnlyPublish = false;
            this.form.controls['MediaReleaseType'].reset({ value: this.currentTemplateMediaId, disabled: true });
            this.applyReadOnlytextBox = true;
            this.applyReadOnlyButtons = true;
            this.toolbarConfig['readOnly'] = true;
        }
        else {
            this.form.controls['MediaReleaseType'].reset({ value: this.currentTemplateMediaId, disabled: false });
            this.applyReadOnlytextBox = false;
            this.applyReadOnlyButtons = false;
            this.appReadOnlyPublish = true;
            this.toolbarConfig['readOnly'] = false;
        }
        this.Action = 'Edit';
        this.showAdd = true;
    }

    validateForm(): boolean {
        if ((this.form.controls['Message'].value == "" || this.form.controls['Message'].value == undefined)
            && (this.form.controls['MediaReleaseType'].value == "" || this.form.controls['MediaReleaseType'].value == undefined)) {
            this.hideMessageError = false;
            this.hideRemarksError = false;
            return false;
        }
        if (this.form.controls['Message'].value == "" || this.form.controls['Message'].value == null || this.form.controls['Message'].value == undefined) {
            this.hideMessageError = false;
            return false;
        }
        else if (this.form.controls['MediaReleaseType'].value == "" || this.form.controls['MediaReleaseType'].value == null || this.form.controls['MediaReleaseType'].value == undefined) {
            this.hideMessageError = true;
            this.hideRemarksError = false;
            return false;
        }
        else {
            this.hideMessageError = true;
            this.hideRemarksError = true;
            return true;
        }
    }

    save(): void {
        if (this.validateForm()) {
            this.hideMessageError = true;
            this.hideRemarksError = true;
            this.media.IsPublished = false;
            this.Action = 'Save';
            this.CreateOrUpdateMediaQuery();
        }
    }

    SentForApproval(): void {
        if (this.validateForm()) {
            this.hideMessageError = true;
            this.hideRemarksError = true;
            this.media.IsPublished = false;
            this.Action = 'SentForApproval';
            this.CreateOrUpdateMediaQuery();
        }
    }

    publish(): void {
        if (this.validateForm()) {
            this.hideMessageError = true;
            this.hideRemarksError = true;
            this.media.IsPublished = true;
            this.media.PublishedBy = +this.credential.UserId;
            this.date = new Date();
            this.media.PublishedOn = this.date;
            this.Action = 'Publish';
            this.CreateOrUpdateMediaQuery();
        }
    }

    cancel(): void {
        this.formInit();
        //this.toolbarConfig['readOnly'] = true;
        this.showAdd = false;
        this.hideMessageError = true;
        this.hideRemarksError = true;
    }

    showAddRegion(ShowAdd: boolean): void {
        this.showAdd = true;
        this.media = new MediaModel();
        this.currentTemplateMediaId = '';
        this.applyReadOnlytextBox = false;
        this.applyReadOnlyButtons = false;
        this.appReadOnlyPublish = true;
        this.isInvalidForm = false;
        // this.isApprovedContent = false;
        // this.isSavedContent = true;
        this.toolbarConfig['readOnly'] = false;
        this.form.controls['MediaReleaseType'].reset({ value: '', disabled: false });
        //this.toolbarConfig['readOnly'] = true;
    }

    public onMessageChange($event): void {
        //this.media.Message = this.form.controls['Message'].value;
        console.log($event);
    }

    public onMessageBlur($event): void {
        console.log($event);
    }
    public onMessageFocus($event): void {
        console.log($event);
    }
    public onMessageReady($event): void {
        console.log($event);
    }

    private CreateOrUpdateMediaQuery(): void {
        UtilityService.setModelFromFormGroup<MediaModel>
            (this.media, this.form, (x) => x.Remarks, (x) => x.MediaReleaseType);

        const mediaTypeId: number = +this.media.MediaReleaseType;
        this.media.MediaReleaseType = this.templateMedias.find((a) => a.TemplateMediaId === mediaTypeId).TemplatePurpose;

        this.media.IncidentId = this.currentIncidentId;
        this.media.InitiateDepartmentId = this.currentDepartmentId;
        this.media.InitiateDepartmentId = this.currentDepartmentId;
        if (this.Action === 'Save') {
            this.media.MediaReleaseStatus = 'Saved';
            this.media.Message = this.form.controls['Message'].value;
        }
        if (this.Action === 'SentForApproval') {
            this.media.SentForApprovalContent = this.form.controls['Message'].value;
            this.media.MediaReleaseStatus = 'SentForApproval';
            this.media.SentForApprovalOn = new Date();

             // This has been implemented to clear the values so that once it gets rejected and goes for re-approval the data model has the values assigned properly
             this.media.ApprovedBy = null;
             this.media.ApprovedOn = null;
             this.media.RejectedBy = null;
             this.media.RejectedOn = null;
        }

        if (this.Action === 'Publish') {
            this.media.MediaReleaseStatus = 'Published';
            delete this.media.Message;
        }

        if (this.media.MediaqueryId === 0) {
            this.media.CreatedBy = +this.credential.UserId;
            this.media.CreatedOn = new Date();

            this.mediaQueryService.Create(this.media)
                .subscribe((response: MediaModel) => {
                    if (this.Action === 'Save')
                        this.toastrService.success('Media release is saved successfully.', 'Success', this.toastrConfig);

                    if (this.Action === 'SentForApproval') {
                        this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.MediaModelSentForApproval, response);
                        this.toastrService.success('Media release is successfully sent for approval.', 'Success', this.toastrConfig);
                    }
                    if (this.media.IsPublished) {
                        this.globalState.NotifyDataChanged(GlobalConstants.DataExchangeConstant.MediaReleasePublished, response);
                        this.toastrService.success('Media release is published successfully.', 'Success', this.toastrConfig);
                    }
                    this.dataExchange.Publish('MediaModelSaved', response);
                    this.showAdd = false;
                    this.formInit();
                }, (error: any) => {
                    console.log(`Error: ${error.message}`);
                });
        }
        else {
            this.media.UpdatedBy = +this.credential.UserId;
            this.media.UpdatedOn = new Date();

            this.mediaQueryService.Update(this.media)
                .subscribe((response: MediaModel) => {
                    if (this.Action === 'Save')
                        this.toastrService.success('Media release is edited successfully.', 'Success', this.toastrConfig);

                    if (this.Action === 'SentForApproval') {
                        this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.MediaModelSentForApproval, response);
                        this.toastrService.success('Media release is successfully sent for approval.', 'Success', this.toastrConfig);
                    }
                    if (this.media.IsPublished) {
                        this.globalState.NotifyDataChanged(GlobalConstants.DataExchangeConstant.MediaReleasePublished, this.media);
                        this.toastrService.success('Media release is published successfully.', 'Success', this.toastrConfig);
                    }
                    this.dataExchange.Publish('MediaModelUpdated', response);
                    this.showAdd = false;
                    this.formInit();
                }, (error: any) => {
                    console.log(`Error: ${error.message}`);
                });
        }

    }

    private formInit(): void {
        this.form = new FormGroup({
            MediaqueryId: new FormControl(0),
            Message: new FormControl('', [Validators.required, Validators.maxLength(500)]),
            //ApprovedContent:  new FormControl(''),
            Remarks: new FormControl('', [Validators.required, Validators.maxLength(500)]),
            MediaReleaseType: new FormControl('')
        });

        this.media = new MediaModel();
        this.Action = 'Save';
        this.currentTemplateMediaId = '';
        this.applyReadOnlytextBox = false;
        this.appReadOnlyPublish = true;
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
    }
}