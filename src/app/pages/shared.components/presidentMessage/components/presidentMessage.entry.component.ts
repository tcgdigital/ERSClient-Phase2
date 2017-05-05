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
        private toastrConfig: ToastrConfig) {
        this.showAdd = false;

    }

    ngOnInit(): void {
        this.InitiateForm();
        this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.initiatedDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.initiatedDepartmentId;
        this.credential = UtilityService.getCredentialDetails();
        this.dataExchange.Subscribe("OnPresidentMessageUpdate", model => this.onPresidentMessageUpdate(model));
        this.globalState.Subscribe('incidentChangefromDashboard', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChangeFromDashboard', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("OnPresidentMessageUpdate");
        this.globalState.Unsubscribe('incidentChangefromDashboard');
        this.globalState.Unsubscribe('departmentChangeFromDashboard');
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
    }

    onPresidentMessageUpdate(presedientMessageModel: PresidentMessageModel): void {
        this.PresidentsMessage = new PresidentMessageModel();
        this.PresidentsMessage = presedientMessageModel;
        this.PresidentsMessage.PresidentsMessageId = presedientMessageModel.PresidentsMessageId;
        this.PresidentsMessage.IsUpdated = true;
        this.Action = "Edit";
        this.showAdd = true;
    }

    save(): void {
        if(this.PresidentsMessage.Message == "" || this.PresidentsMessage.Message == null || this.PresidentsMessage.Message == undefined)
        {
            this.hideMessageError = false;
        } 
        else if(this.PresidentsMessage.Remarks == "" || this.PresidentsMessage.Remarks == null || this.PresidentsMessage.Remarks == undefined)
        {
            this.hideMessageError = true;
            this.hideRemarksError = false;
        } 
        else
        {
            this.hideMessageError = true;
            this.hideRemarksError = true;
            this.PresidentsMessage.IsPublished = false;
            this.Action = "Save";
            this.CreateOrUpdatePresidentMessage();
        }        
    
    }

    publish(): void {

        if(this.PresidentsMessage.Message == "" || this.PresidentsMessage.Message == null || this.PresidentsMessage.Message == undefined)
        {
            this.hideMessageError = false;
        } 
        else if(this.PresidentsMessage.Remarks == "" || this.PresidentsMessage.Remarks == null || this.PresidentsMessage.Remarks == undefined)
        {
            this.hideMessageError = true;
            this.hideRemarksError = false;
        } 
       else {
            this.hideMessageError = true;
            this.hideRemarksError = true;
            this.PresidentsMessage.IsPublished = true;
            this.PresidentsMessage.PublishedBy = +this.credential.UserId;;
            this.date = new Date();
            this.PresidentsMessage.PublishedOn = this.date;
            //this.Action = "Publish";
            this.CreateOrUpdatePresidentMessage();
        }
    }

    private CreateOrUpdatePresidentMessage(): void {
        UtilityService.setModelFromFormGroup<PresidentMessageModel>
            (this.PresidentsMessage, this.form, x => x.Message, x => x.Remarks);

        if (this.PresidentsMessage.PresidentsMessageId == 0) {
            this.PresidentsMessage.CreatedBy = +this.credential.UserId;
            this.PresidentsMessage.IncidentId = this.currentIncidentId;
            this.PresidentsMessage.InitiateDepartmentId = this.currentDepartmentId;

            this.presidentMessageService.Create(this.PresidentsMessage)
                .subscribe((response: PresidentMessageModel) => {
                    this.toastrService.success('President message Saved successfully.', 'Success', this.toastrConfig);
                    this.dataExchange.Publish("PresidentMessageModelSaved", response);
                    if(this.PresidentsMessage.IsPublished)
                    {
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
            this.presidentMessageService.Update(this.PresidentsMessage)
                .subscribe((response: PresidentMessageModel) => {
                    this.toastrService.success('President message edited successfully.', 'Success', this.toastrConfig);
                    this.dataExchange.Publish("PresidentMessageModelUpdated", response);
                    
                    if(this.PresidentsMessage.IsPublished)
                    {
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
    };

    private InitiateForm(): void {
        this.form = new FormGroup({
            PresidentsMessageId: new FormControl(0),
            Message: new FormControl('', [Validators.required, Validators.maxLength(500)]),
            Remarks: new FormControl('', [Validators.required, Validators.maxLength(500)])
        });

        this.PresidentsMessage = new PresidentMessageModel()
        this.Action = "Save";
    };

    showAddRegion(ShowAdd: Boolean): void {
        this.showAdd = true;
    };
}