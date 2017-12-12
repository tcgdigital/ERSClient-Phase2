import {
    Component, ViewEncapsulation, OnDestroy,
    Output, EventEmitter, OnInit, Input
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
    FormGroup, FormControl,
    FormBuilder, AbstractControl, Validators
} from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';


import { PresidentMessageService } from './presidentMessage.service';
import { PresidentMessageModel } from './presidentMessage.model';
import {
    ResponseModel, DataExchangeService, KeyValue,
    GlobalConstants, UtilityService, GlobalStateService, AuthModel
} from '../../../../shared';

import { TemplateMediaModel, TemplateMediaService } from '../../template.media/components';

@Component({
    selector: 'presidentMessage-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/presidentMessage.entry.view.html'
})
export class PresidentMessageEntryComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: number;
    @Input() incidentId: number;

    public form: FormGroup;
    PresidentsMessage: PresidentMessageModel;
    date: Date = new Date();
    precidentMessages: PresidentMessageModel[] = [];
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
    public isShow: boolean = true;
    toolbarConfig: any = GlobalConstants.EditorToolbarConfig;

    /**
     * Creates an instance of PresidentMessageEntryComponent.
     * @param {PresidentMessageService} presidentMessageService 
     * @param {DataExchangeService<PresidentMessageModel>} dataExchange 
     * @param {GlobalStateService} globalState 
     * @param {FormBuilder} builder 
     * 
     * @memberOf PresidentMessageEntryComponent
     */
    constructor(private presidentMessageService: PresidentMessageService,
        private dataExchange: DataExchangeService<PresidentMessageModel>,
        private globalState: GlobalStateService,
        private builder: FormBuilder,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private templateMediaService: TemplateMediaService) {
        this.showAdd = false;

    }

    ngOnInit(): void {
        this.InitiateForm();
        this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.initiatedDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.initiatedDepartmentId;
        this.getTemplateMedias();
        this.credential = UtilityService.getCredentialDetails();
        this.dataExchange.Subscribe("OnPresidentMessageUpdate", model => this.onPresidentMessageUpdate(model));
        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    ngOnDestroy(): void {
        //this.dataExchange.Unsubscribe("OnPresidentMessageUpdate");
        //this.globalState.Unsubscribe('incidentChangefromDashboard');
        //this.globalState.Unsubscribe('departmentChangeFromDashboard');
    }

    getTemplateMedias(): void {
        this.templateMediaService.GetAll()
            .subscribe((response: ResponseModel<TemplateMediaModel>) => {
                this.templateMedias = response.Records
                    .filter((a) => a.TemplateType === 'President Message');
            });
    }

    getContentFromTemplate(evt: any) {
        if (evt.target.value !== '') {
            const templateId = evt.target.value;
            
            this.presidentMessageService.GetContentFromTemplate(this.currentIncidentId, this.currentDepartmentId, +templateId)
                .subscribe((response: any) => {
                    this.templateContent = `${response.Body}`;
                    this.PresidentsMessage.Message = this.templateContent;
                    this.applyReadOnlytextBox = false; 
                });
        }
        else {
            this.PresidentsMessage.Message = '';
            this.applyReadOnlytextBox = true;
        }
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
    }

    onPresidentMessageUpdate(presedientMessageModel: PresidentMessageModel): void {
         this.currentTemplateMediaId = this.templateMedias
            .find((a) => a.TemplatePurpose === presedientMessageModel.PresidentMessageType).TemplateMediaId.toString();

        if(presedientMessageModel.PresidentMessageStatus === 'Approved' || presedientMessageModel.PresidentMessageStatus === 'Published')
        {
            this.PresidentsMessage = new PresidentMessageModel();
            this.PresidentsMessage = presedientMessageModel;
            this.PresidentsMessage.PresidentsMessageId = presedientMessageModel.PresidentsMessageId;
            this.PresidentsMessage.Message = this.PresidentsMessage.ApprovedContent;
        }
        else
        {
            this.PresidentsMessage = new PresidentMessageModel();
            this.PresidentsMessage = presedientMessageModel;
            this.PresidentsMessage.PresidentsMessageId = presedientMessageModel.PresidentsMessageId;
            this.PresidentsMessage.IsUpdated = true;
        }            
      
        if (this.PresidentsMessage.PresidentMessageStatus === 'SentForApproval' || this.PresidentsMessage.PresidentMessageStatus === 'Published') {
            this.form.controls['PresidentMessageType'].reset({ value: this.currentTemplateMediaId, disabled: true });
            this.applyReadOnlytextBox = true;
            this.applyReadOnlyButtons = true;
            this.appReadOnlyPublish = true;
            this.toolbarConfig['readOnly'] = true;
        }        
        else if (this.PresidentsMessage.PresidentMessageStatus === 'Approved') {
            this.appReadOnlyPublish = false;
            this.form.controls['PresidentMessageType'].reset({ value: this.currentTemplateMediaId, disabled: true });
            this.applyReadOnlytextBox = true;
            this.applyReadOnlyButtons = true;
            this.toolbarConfig['readOnly'] = true;
        }
        else {
            this.form.controls['PresidentMessageType'].reset({ value: this.currentTemplateMediaId, disabled: false });
            this.applyReadOnlytextBox = false;
            this.applyReadOnlyButtons = false;
            this.appReadOnlyPublish = true;
            this.toolbarConfig['readOnly'] = false;
        }
        this.Action = 'Edit';
        this.showAdd = true;
    }

    validateForm(): boolean {
        if((this.form.controls['Message'].value == "" || this.form.controls['Message'].value == undefined) 
        && (this.form.controls['PresidentMessageType'].value == "" || this.form.controls['PresidentMessageType'].value == undefined ))
        {
            this.hideMessageError = false;
            this.hideRemarksError = false;
            return false;
        }
        if(this.form.controls['Message'].value == "" || this.form.controls['Message'].value == null || this.form.controls['Message'].value == undefined)
        {
            this.hideMessageError = false;
            return false;
        } 
        else if(this.form.controls['PresidentMessageType'].value == "" || this.form.controls['PresidentMessageType'].value == null || this.form.controls['PresidentMessageType'].value == undefined)
        {
            this.hideMessageError = true;
            this.hideRemarksError = false;
            return false;
        } 
        else
        {               
            this.hideMessageError = true;
            this.hideRemarksError = true;    
            return true;
        }
    }
    

    save(): void {
        if(this.validateForm()) 
        {
            this.hideMessageError = true;
            this.hideRemarksError = true;
            this.PresidentsMessage.IsPublished = false;
            this.Action = 'Save';
            this.CreateOrUpdatePresidentMessage();
        }
    }

    SentForApproval(): void {
        if(this.validateForm())
        {
            this.hideMessageError = true;
            this.hideRemarksError = true;
            this.PresidentsMessage.IsPublished = false;
            this.Action = 'SentForApproval';
            this.CreateOrUpdatePresidentMessage();
        }        
    }

    publish(): void {

        if(this.validateForm()) 
        {
            this.hideMessageError = true;
            this.hideRemarksError = true;
            this.PresidentsMessage.IsPublished = true;
            this.PresidentsMessage.PublishedBy = +this.credential.UserId;;
            this.date = new Date();
            this.PresidentsMessage.PublishedOn = this.date;
            this.Action = 'Publish';
            this.CreateOrUpdatePresidentMessage();
        }
    }

    private CreateOrUpdatePresidentMessage(): void {
        UtilityService.setModelFromFormGroup<PresidentMessageModel>
            (this.PresidentsMessage, this.form, (x) => x.Remarks, (x) => x.PresidentMessageType);
        
        const presidentsTypeId: number = +this.PresidentsMessage.PresidentMessageType;
        this.PresidentsMessage.PresidentMessageType = this.templateMedias.find((a) => a.TemplateMediaId === presidentsTypeId).TemplatePurpose;

        this.PresidentsMessage.IncidentId = this.currentIncidentId;
        this.PresidentsMessage.InitiateDepartmentId = this.currentDepartmentId;
        this.PresidentsMessage.InitiateDepartmentId = this.currentDepartmentId;
        if (this.Action === 'Save') {
            this.PresidentsMessage.PresidentMessageStatus = 'Saved';
            this.PresidentsMessage.Message = this.form.controls['Message'].value;
        }
        if (this.Action === 'SentForApproval') {
            this.PresidentsMessage.SentForApprovalContent = this.form.controls['Message'].value;
            this.PresidentsMessage.PresidentMessageStatus = 'SentForApproval';
            this.PresidentsMessage.SentForApprovalOn = new Date();
        }

        if (this.Action === 'Publish') {
            this.PresidentsMessage.PresidentMessageStatus = 'Published';
            delete this.PresidentsMessage.Message;
        }

        if (this.PresidentsMessage.PresidentsMessageId == 0) {
            this.PresidentsMessage.CreatedBy = +this.credential.UserId;
            this.PresidentsMessage.IncidentId = this.currentIncidentId;
            this.PresidentsMessage.InitiateDepartmentId = this.currentDepartmentId;

            this.presidentMessageService.Create(this.PresidentsMessage)
                .subscribe((response: PresidentMessageModel) => {
                    if (this.Action === 'Save') 
                        this.toastrService.success('President message is saved successfully.', 'Success', this.toastrConfig);
                    
                     if (this.Action === 'SentForApproval') {
                        this.dataExchange.Publish('PresidentsMessageSentForApproval', response);
                        this.toastrService.success('President message is successfully sent for approval.', 'Success', this.toastrConfig);
                    }

                     if (this.PresidentsMessage.IsPublished) {
                        this.globalState.NotifyDataChanged('PresidentsMessagePublished', response);
                        this.toastrService.success('President message is published successfully.', 'Success', this.toastrConfig);
                    }

                    this.dataExchange.Publish("PresidentMessageModelSaved", response);

                    if (this.PresidentsMessage.IsPublished) {
                        this.globalState.NotifyDataChanged('PresidentMessagePublished', response);
                    }
                    this.InitiateForm();
                    this.showAdd = false;
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
            this.PresidentsMessage.UpdatedBy = +this.credential.UserId;
            this.PresidentsMessage.UpdatedOn = new Date();
            this.presidentMessageService.Update(this.PresidentsMessage)
                .subscribe((response: PresidentMessageModel) => {
                     if (this.Action === 'Save') 
                        this.toastrService.success('President message is saved successfully.', 'Success', this.toastrConfig);
                    
                     if (this.Action === 'SentForApproval') {
                        this.dataExchange.Publish('PresidentsMessageSentForApproval', response);
                        this.toastrService.success('President message is successfully sent for approval.', 'Success', this.toastrConfig);
                    }

                     if (this.PresidentsMessage.IsPublished) {
                        this.globalState.NotifyDataChanged('PresidentsMessagePublished', response);
                        this.toastrService.success('President message is published successfully.', 'Success', this.toastrConfig);
                    }

                    this.dataExchange.Publish("PresidentMessageModelUpdated", response);

                    if (this.PresidentsMessage.IsPublished) {
                        this.globalState.NotifyDataChanged('PresidentMessagePublished', this.PresidentsMessage);

                    }
                    this.InitiateForm();
                    this.showAdd = false;
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
    }

    cancel(): void {
        this.InitiateForm();
        this.showAdd = false;
        this.hideMessageError = true;
        this.hideRemarksError = true;
    }

    private InitiateForm(): void {
        this.form = new FormGroup({
            PresidentsMessageId: new FormControl(0),
            Message: new FormControl('', [Validators.required]),
            Remarks: new FormControl(''),
            PresidentMessageType: new FormControl('')
        });

        this.PresidentsMessage = new PresidentMessageModel()
        this.Action = "Save";
        this.currentTemplateMediaId = '';
        this.applyReadOnlytextBox = false;
        this.appReadOnlyPublish = true;
    }

    showAddRegion(ShowAdd: Boolean): void {
        this.showAdd = true;
        this.PresidentsMessage = new PresidentMessageModel();
        this.currentTemplateMediaId = '';
        this.applyReadOnlytextBox = false;
        this.applyReadOnlyButtons = false;
        this.appReadOnlyPublish = true;       
        this.toolbarConfig['readOnly'] = false;
        this.form.controls['PresidentMessageType'].reset({ value: '', disabled: false });
    }

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