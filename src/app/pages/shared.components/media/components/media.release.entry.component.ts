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
import { MediaModel, MediaReleaseTemplate } from './media.model';
import {
    ResponseModel, UtilityService, KeyValue, 
    DataExchangeService, GlobalConstants, GlobalStateService, AuthModel
} from '../../../../shared';

import { TemplateMediaModel, TemplateMediaService } from '../../template.media/components';


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
        this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.initiatedDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.initiatedDepartmentId;
        this.formInit();
        this.getTemplateMedias();        
        this.credential = UtilityService.getCredentialDetails();
        this.dataExchange.Subscribe("OnMediaReleaseUpdate", model => this.onMediaReleaseUpdate(model));
        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));
    }
    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("OnMediaReleaseUpdate");
        this.globalState.Unsubscribe('incidentChangefromDashboard');
        this.globalState.Unsubscribe('departmentChangeFromDashboard');

    }

    getTemplateMedias(): void{
        this.templateMediaService.GetAll()
        .subscribe((response: ResponseModel<TemplateMediaModel>) => {
            this.templateMedias = response.Records.filter(a=>a.TemplateType === 'Media Release');            
        })
    }    

    getContentFromTemplate(evt: any)
    {       
        if(evt.target.value != '')
        {
            let templateId = evt.target.value;
            this.mediaQueryService.GetContentFromTemplate(this.currentIncidentId, this.currentDepartmentId, +templateId)
            .subscribe((response: any) =>{
                this.templateContent = `${response.Subject}\n\r${response.Body}`;                
                this.media.Message = this.templateContent;
                this.applyReadOnlytextBox = false;
            });
        }
        else
        {
            this.media.Message = '';
            this.applyReadOnlytextBox = true;
        }
    }

    onMediaReleaseUpdate(mediaModel: MediaModel): void {
        this.media = new MediaModel();
        this.media = mediaModel;
        this.media.MediaqueryId = mediaModel.MediaqueryId;
        this.media.IsUpdated = true;
        this.currentTemplateMediaId = this.templateMedias.find(a=>a.TemplatePurpose === mediaModel.MediaReleaseType).TemplateMediaId.toString();   
        if(this.media.MediaReleaseStatus === 'SentForApproval' || this.media.MediaReleaseStatus === 'Published')
        {            
            this.form.controls["MediaReleaseType"].reset({ value: this.currentTemplateMediaId, disabled: true });
            this.applyReadOnlytextBox = true;  
            this.applyReadOnlyButtons = true;
            this.appReadOnlyPublish = true;
        }
        else if(this.media.MediaReleaseStatus === 'Approved')
        {
            this.appReadOnlyPublish = false;
            this.form.controls["MediaReleaseType"].reset({ value: this.currentTemplateMediaId, disabled: true });
            this.applyReadOnlytextBox = true;  
            this.applyReadOnlyButtons = true;
        }
        else
        {
            this.form.controls["MediaReleaseType"].reset({ value: this.currentTemplateMediaId, disabled: false });
            this.applyReadOnlytextBox = false;  
            this.applyReadOnlyButtons = false;
            this.appReadOnlyPublish = true;
        }
        this.Action = "Edit";
        this.showAdd = true;
    }

    save(): void {
        if(this.media.Message == "" || this.media.Message == null || this.media.Message == undefined)
        {
            this.hideMessageError = false;
        } 
        else if(this.media.Remarks == "" || this.media.Remarks == null || this.media.Remarks == undefined)
        {
            this.hideMessageError = true;
            this.hideRemarksError = false;
        } 
        else
        {
               
            this.hideMessageError = true;
            this.hideRemarksError = true;    
            this.media.IsPublished = false;
            this.Action = "Save";
            this.CreateOrUpdateMediaQuery();
        }
        
    }

    SentForApproval(): void {
        this.Action = "SentForApproval";
        this.CreateOrUpdateMediaQuery();
    }

    publish(): void {
        if(this.media.Message == "" || this.media.Message == null || this.media.Message == undefined)
        {
            this.hideMessageError = false;
        } 
        else if(this.media.Remarks == "" || this.media.Remarks == null || this.media.Remarks == undefined)
        {
            this.hideMessageError = true;
            this.hideRemarksError = false;
        } 
        else
        {
            this.hideMessageError = true;
            this.hideRemarksError = true;
            this.media.IsPublished = true;
            this.media.PublishedBy = +this.credential.UserId;;
            this.date = new Date();
            this.media.PublishedOn = this.date;
            this.Action = "Publish";
            this.CreateOrUpdateMediaQuery();      
        }            
    }

    private CreateOrUpdateMediaQuery(): void {
        UtilityService.setModelFromFormGroup<MediaModel>
            (this.media, this.form, x => x.Remarks, x=>x.MediaReleaseType);

        let mediaTypeId: number = +this.media.MediaReleaseType;
        this.media.MediaReleaseType = this.templateMedias.find(a=>a.TemplateMediaId == mediaTypeId).TemplatePurpose;

        this.media.IncidentId = this.currentIncidentId;
        this.media.InitiateDepartmentId = this.currentDepartmentId;
        this.media.InitiateDepartmentId = this.currentDepartmentId;
        if(this.Action ==="Save")
        {
            this.media.MediaReleaseStatus = "Saved";
            this.media.Message = this.form.controls['Message'].value;
        }
        if(this.Action === "SentForApproval")
        {                
                this.media.SentForApprovalContent = this.form.controls['Message'].value;;
                this.media.MediaReleaseStatus = "SentForApproval";
                this.media.SentForApprovalOn = new Date();                               
        }

        if(this.Action === "Publish")
        {                
            this.media.MediaReleaseStatus = "Published";
        }

        if (this.media.MediaqueryId == 0) {                       
            this.media.CreatedBy = +this.credential.UserId;
            this.media.CreatedOn =  new Date();
            this.mediaQueryService.Create(this.media)
                .subscribe((response: MediaModel) => {
                    this.toastrService.success('Media release Saved successfully.', 'Success', this.toastrConfig);
                    this.dataExchange.Publish("MediaModelSaved", response);
                    if(this.Action === "SentForApproval")
                    {
                        this.dataExchange.Publish("MediaModelSentForApproval", response);
                    }
                    if(this.media.IsPublished)
                    {                                               
                        this.globalState.NotifyDataChanged('MediaReleasePublished', response);
                    }
                    this.showAdd = false;
                    this.formInit();
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {            
            this.media.UpdatedBy = +this.credential.UserId;
            this.media.UpdatedOn = new Date();
            this.mediaQueryService.Update(this.media)
                .subscribe((response: MediaModel) => {
                    this.toastrService.success('Media release edited successfully.', 'Success', this.toastrConfig);
                    this.dataExchange.Publish("MediaModelUpdated", response);
                    if(this.Action === "SentForApproval")
                    {
                        this.dataExchange.Publish("MediaModelSentForApproval", response);
                    }
                    if(this.media.IsPublished)
                    {                        
                        this.globalState.NotifyDataChanged('MediaReleasePublished', this.media);
                    
                    }  
                    this.showAdd = false; 
                    this.formInit();
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
    }

    cancel(): void {
        this.formInit();
        this.showAdd = false;
        this.hideMessageError = true;
        this.hideRemarksError = true; 
    }

     

    private formInit(): void {
        this.form = new FormGroup({
            MediaqueryId: new FormControl(0),
            Message: new FormControl('', [Validators.required, Validators.maxLength(500)]),
            Remarks: new FormControl('', [Validators.required, Validators.maxLength(500)]),
            MediaReleaseType: new FormControl('')         
        });

        this.media = new MediaModel();
        this.Action = "Save";
        this.currentTemplateMediaId = '';
        this.applyReadOnlytextBox = false;
        this.appReadOnlyPublish = true;;
    }

    showAddRegion(ShowAdd: Boolean): void {
        this.showAdd = true;
        this.currentTemplateMediaId = '';
        this.applyReadOnlytextBox = false;
        this.applyReadOnlyButtons = false;
        this.appReadOnlyPublish = true;
    };
}