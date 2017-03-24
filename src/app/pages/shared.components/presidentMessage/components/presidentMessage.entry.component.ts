import {
    Component, ViewEncapsulation, OnDestroy,
    Output, EventEmitter, OnInit, Input
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
    FormGroup, FormControl,
    FormBuilder, AbstractControl, Validators
} from '@angular/forms';

import { PresidentMessageService } from './presidentMessage.service';
import { PresidentMessageModel } from './presidentMessage.model';
import {
    ResponseModel, DataExchangeService,
    GlobalConstants, UtilityService
} from '../../../../shared';

@Component({
    selector: 'presidentMessage-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/presidentMessage.entry.view.html'
})
export class PresidentMessageEntryComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: string;
    @Input() currentIncidentId: string;

    public form: FormGroup;
    PresidentsMessage: PresidentMessageModel;
    date: Date = new Date();
    precidentMessages: PresidentMessageModel[] = [];
    Action: string;

    /**
     * Creates an instance of PresidentMessageEntryComponent.
     * @param {PresidentMessageService} presidentMessageService 
     * @param {DataExchangeService<PresidentMessageModel>} dataExchange 
     * @param {FormBuilder} builder 
     * 
     * @memberOf PresidentMessageEntryComponent
     */
    constructor(private presidentMessageService: PresidentMessageService,
        private dataExchange: DataExchangeService<PresidentMessageModel>,
        private builder: FormBuilder) { }

    ngOnInit(): void {
        this.InitiateForm();
        this.dataExchange.Subscribe("OnPresidentMessageUpdate", model => this.onPresidentMessageUpdate(model))
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("OnPresidentMessageUpdate");
    }

    onPresidentMessageUpdate(presedientMessageModel: PresidentMessageModel): void {
        this.PresidentsMessage = presedientMessageModel;
        this.PresidentsMessage.PresidentsMessageId = presedientMessageModel.PresidentsMessageId;
        this.PresidentsMessage.IncidentId = +this.currentIncidentId;
        this.PresidentsMessage.InitiateDepartmentId = +this.initiatedDepartmentId;
        this.PresidentsMessage.IsUpdated = true;
        this.Action = "Edit";
    }

    save(): void {
        if (this.form.valid) {
            this.PresidentsMessage.IsPublished = false;
            this.Action = "Save";
            this.CreateOrUpdatePresidentMessage();
        }
    }

    publish(): void {
        if (this.form.valid) {
            this.PresidentsMessage.IsPublished = true;
            this.PresidentsMessage.PublishedBy = 1;
            this.PresidentsMessage.PublishedOn = this.date;
            this.Action = "Publish";
            this.CreateOrUpdatePresidentMessage();
        }
    }

    private CreateOrUpdatePresidentMessage(): void {
        UtilityService.setModelFromFormGroup<PresidentMessageModel>
            (this.PresidentsMessage, this.form, x => x.Message, x => x.Remarks);
            
        if (this.PresidentsMessage.PresidentsMessageId == 0) {
            this.presidentMessageService.Create(this.PresidentsMessage)
                .subscribe((response: PresidentMessageModel) => {
                    this.dataExchange.Publish("PresidentMessageModelSaved", response);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
            this.presidentMessageService.Update(this.PresidentsMessage)
                .subscribe((response: PresidentMessageModel) => {
                    this.dataExchange.Publish("PresidentMessageModelUpdated", response);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
    }

    cancel(): void {
        this.InitiateForm();
    }

    private InitiateForm(): void {
        this.form = new FormGroup({
            PresidentsMessageId: new FormControl(0),
            Message: new FormControl('', [Validators.required, Validators.maxLength(500)]),
            Remarks: new FormControl('', [Validators.required, Validators.maxLength(500)])
        });

        this.PresidentsMessage = new PresidentMessageModel()
        this.PresidentsMessage.IncidentId = +this.currentIncidentId;
        this.PresidentsMessage.InitiateDepartmentId = +this.initiatedDepartmentId;
        this.Action = "Save";
    }
}