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
    selector: 'mediaRelease-approval-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/media.release.approval.entry.view.html'
})
export class MediaReleaseApprovalEntryComponent implements OnInit, OnDestroy {
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

    onMediaReleaseUpdate(mediaModel: MediaModel): void {
        debugger;
        this.media = new MediaModel();
        this.media = mediaModel;
        this.media.MediaqueryId = mediaModel.MediaqueryId;
        this.media.IsUpdated = true;
        this.Action = "Edit";
        this.showAdd = true;
    }

    approve(): void { 
        this.validateForm();       
        this.media.IsPublished = false;
        this.Action = "Approve";
        this.UpdateMediaQuery();           
    }

    validateForm(): void{
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
        }
    }

    reject(): void {
        this.validateForm();
        this.Action = "Reject";
        this.UpdateMediaQuery();
    }

    private UpdateMediaQuery(): void {
        UtilityService.setModelFromFormGroup<MediaModel>
            (this.media, this.form, x => x.Remarks);

        let mediaTypeId: number = +this.media.MediaReleaseType;  
        this.media.IncidentId = this.currentIncidentId;
        this.media.InitiateDepartmentId = this.currentDepartmentId;
        this.media.InitiateDepartmentId = this.currentDepartmentId;
        if(this.Action ==="Approve")
        {
            this.media.MediaReleaseStatus = "Approved";
            this.media.ApprovedContent = this.form.controls['Message'].value;
            this.media.ApprovedBy = +this.credential.UserId            
            this.media.ApproverDepartmentId = this.currentDepartmentId;
            this.media.ApprovedOn = new Date();
        }
        if(this.Action === "Reject")
        {                
            this.media.SentForApprovalContent = this.media.Message;
            this.media.MediaReleaseStatus = "Rejected";
            this.media.ApprovedBy = +this.credential.UserId;    
            this.media.ApproverDepartmentId = this.currentDepartmentId;
            this.media.RejectedOn = new Date();                            
        }
        this.media.UpdatedBy = +this.credential.UserId;
        this.media.UpdatedOn = new Date();
        this.mediaQueryService.Update(this.media)
            .subscribe((response: MediaModel) => {
                this.toastrService.success('Media release edited successfully.', 'Success', this.toastrConfig);
                this.dataExchange.Publish("MediaModelUpdated", response);                                                
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
    }

    showAddRegion(ShowAdd: Boolean): void {
        this.showAdd = true;
    };
}