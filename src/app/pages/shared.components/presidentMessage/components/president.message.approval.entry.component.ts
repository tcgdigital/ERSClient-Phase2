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


@Component({
    selector: 'presidentMessage-approval-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/president.message.approval.entry.view.html'
})
export class PresidentMessageApprovalEntryComponent implements OnInit, OnDestroy {
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
    templateContent: string;
    currentTemplateMediaId: string;
    applyReadOnlytextBox: boolean = false;
    applyReadOnlyButtons: boolean = false;
    appReadOnlyPublish: boolean = true;
    isInvalidForm: boolean = false;
    isApprovedContent: boolean = false;
    isSavedContent: boolean = true;

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
        private toastrConfig: ToastrConfig)
        {
            this.showAdd = false;
        }

    ngOnInit(): void {
        this.InitiateForm();
        this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.initiatedDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.initiatedDepartmentId;
        this.credential = UtilityService.getCredentialDetails();
        this.dataExchange.Subscribe("OnPresidentMessageApprovalUpdate", model => this.onPresidentMessageUpdate(model));
        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("OnPresidentMessageApprovalUpdate");
        this.globalState.Unsubscribe('incidentChangefromDashboard');
        this.globalState.Unsubscribe('departmentChangeFromDashboard');
    }

    onPresidentMessageUpdate(presidentMessageModel: PresidentMessageModel): void {
        this.PresidentsMessage = new PresidentMessageModel();
        this.PresidentsMessage = presidentMessageModel;
        this.PresidentsMessage.PresidentsMessageId = presidentMessageModel.PresidentsMessageId;        
        this.PresidentsMessage.IsUpdated = true;
        this.Action = "Edit";
        this.showAdd = true;
        this.toolbarConfig['readOnly'] = false;
    }

    private InitiateForm(): void {
        this.form = new FormGroup({
            PresidentsMessageId: new FormControl(0),
            Message: new FormControl('', [Validators.required]),
            Remarks: new FormControl('')            
        });

        this.PresidentsMessage = new PresidentMessageModel()
        this.Action = "Save";
        this.currentTemplateMediaId = '';
        this.applyReadOnlytextBox = false;
        this.appReadOnlyPublish = true;
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

    approve(): void { 
       if(this.validateForm())
        {
            this.PresidentsMessage.IsPublished = false;
            this.Action = "Approve";
            this.UpdatePresidentMessage();
        }           
    }

    reject(): void {
        if(this.validateForm())
        {
            this.PresidentsMessage.IsPublished = false;
            this.Action = "Reject";
            this.UpdatePresidentMessage();
        }
    }

    private UpdatePresidentMessage(): void {
        UtilityService.setModelFromFormGroup<PresidentMessageModel>
            (this.PresidentsMessage, this.form, x => x.Remarks);
       
        this.PresidentsMessage.IncidentId = this.currentIncidentId;
        this.PresidentsMessage.InitiateDepartmentId = this.currentDepartmentId;
        if(this.Action ==="Approve")
        {
            this.PresidentsMessage.PresidentMessageStatus = "Approved";
            this.PresidentsMessage.ApprovedContent = this.form.controls['Message'].value;
            this.PresidentsMessage.ApprovedBy = +this.credential.UserId            
            this.PresidentsMessage.ApproverDepartmentId = this.currentDepartmentId;
            this.PresidentsMessage.ApprovedOn = new Date();
        }
        if(this.Action === "Reject")
        {                
            this.PresidentsMessage.Message = this.form.controls['Message'].value;
            this.PresidentsMessage.PresidentMessageStatus = "Rejected";
            this.PresidentsMessage.RejectedBy = +this.credential.UserId;    
            this.PresidentsMessage.ApproverDepartmentId = this.currentDepartmentId;
            this.PresidentsMessage.RejectedOn = new Date();                            
        }
        
        this.PresidentsMessage.UpdatedBy = +this.credential.UserId;
        this.PresidentsMessage.UpdatedOn = new Date();
        this.presidentMessageService.Update(this.PresidentsMessage)
            .subscribe((response: PresidentMessageModel) => {
                if(this.Action ==="Approve")
                    this.toastrService.success('President Message is approved successfully.', 'Success', this.toastrConfig);
                if(this.Action === "Reject")
                     this.toastrService.success('President Message is rejected successfully.', 'Success', this.toastrConfig);
                     
                this.dataExchange.Publish("PresidentMessageApprovalUpdated", response);                                                
               
                this.showAdd = false; 
                this.InitiateForm();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    
    cancel(): void {
        this.InitiateForm();
        this.showAdd = false;
        this.hideMessageError = true;
        this.hideRemarksError = true;
    }

     showAddRegion(ShowAdd: Boolean): void {
        this.showAdd = true;
        this.PresidentsMessage = new PresidentMessageModel();
        this.currentTemplateMediaId = '';
        this.applyReadOnlytextBox = false;
        this.applyReadOnlyButtons = false;
        this.appReadOnlyPublish = true;       
        this.toolbarConfig['readOnly'] = false;        
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
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