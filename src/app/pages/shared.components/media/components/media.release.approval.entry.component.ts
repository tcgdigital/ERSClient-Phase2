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
    UtilityService, KeyValue, 
    DataExchangeService, GlobalConstants, GlobalStateService, AuthModel
} from '../../../../shared';

import { TemplateMediaService } from '../../template.media/components';
import { Subject } from 'rxjs/Subject';

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
    isInvalidForm: boolean = false;
    
    toolbarConfig: any = GlobalConstants.EditorToolbarConfig;
    public isShowApproveRejectMediaMessage: boolean = true;
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
        this.toolbarConfig['readOnly'] = false;
    }

    ngOnInit(): void {
        this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.initiatedDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.initiatedDepartmentId;
        this.isInvalidForm = false;
        this.formInit();   
        this.toolbarConfig['readOnly'] = false;    
        this.credential = UtilityService.getCredentialDetails();

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.OnMediaReleaseApproverUpdate, 
            (model: MediaModel) => this.onMediaReleaseUpdate(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard, 
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard, 
            (model: KeyValue) => this.departmentChangeHandler(model));
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
    }

    ngOnDestroy(): void {
        //this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.OnMediaReleaseApproverUpdate);
        //this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard);
        //this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }    

    onMediaReleaseUpdate(mediaModel: MediaModel): void {
        this.media = new MediaModel();
        this.media = mediaModel;
        this.media.MediaqueryId = mediaModel.MediaqueryId;        
        this.media.IsUpdated = true;
        this.Action = "Edit";
        this.showAdd = true;
        this.toolbarConfig['readOnly'] = false;
    }

    approve(): void { 
       if(this.validateForm())
        {
            this.media.IsPublished = false;
            this.Action = "Approve";
            this.UpdateMediaQuery();
        }           
    }

    reject(): void {
        if(this.validateForm())
        {
            this.Action = "Reject";
            this.UpdateMediaQuery();
        }
    }

   validateForm(): boolean{
        if((this.form.controls['Message'].value == "" || this.form.controls['Message'].value == undefined))
        {
            this.hideMessageError = false;
            this.hideRemarksError = false;
            return false;
        }
        else
        {
            return true;
        }
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
            this.media.Message = this.form.controls['Message'].value;
            this.media.MediaReleaseStatus = "Rejected";
            this.media.RejectedBy = +this.credential.UserId;    
            this.media.ApproverDepartmentId = this.currentDepartmentId;
            this.media.RejectedOn = new Date();                            
        }
        
        this.media.UpdatedBy = +this.credential.UserId;
        this.media.UpdatedOn = new Date();
        
        this.mediaQueryService.Update(this.media)
            .subscribe((response: MediaModel) => {
                if(this.Action ==="Approve")
                    this.toastrService.success('Media release is approved successfully.', 'Success', this.toastrConfig);
                if(this.Action === "Reject")
                     this.toastrService.success('Media release is rejected successfully.', 'Success', this.toastrConfig);
                     
                this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.MediaModelApprovalUpdated, response);                                                
                if(this.media.IsPublished)
                {                        
                    this.globalState.NotifyDataChanged(GlobalConstants.DataExchangeConstant.MediaReleasePublished, this.media);
                
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

    public onMessageChange($event): void {
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
}