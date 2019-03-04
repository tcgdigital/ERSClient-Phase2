import { Component, ViewEncapsulation, OnInit, OnDestroy } from "@angular/core";
import { UserProfileService } from "../../../shared.components";
import { TemplateModel } from "./template.model";
import { DataExchangeService, GlobalStateService, UtilityService, AuthModel, GlobalConstants, KeyValue, ResponseModel } from "../../../../shared";
import { ToastrService, ToastrConfig } from "ngx-toastr";
import { TemplateService } from "./template.service";
import { EmergencySituationService } from "../../emergency.situation";
import {
    FormGroup,
    FormControl,
    Validators
} from '@angular/forms';
import { Subject } from "rxjs";

@Component({
    selector: 'template-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/template.entry.view.html',
    //styleUrls: ['../styles/template.style.scss']
})
export class TemplateEntryComponent implements OnInit, OnDestroy {
    /**
     *Creates an instance of DepartmentEntryComponent.
     * @param {DepartmentService} departmentService
     * @param {UserProfileService} userService
     * @param {DataExchangeService<TemplateModel>} dataExchange
     * @param {ToastrService} toastrService
     * @param {ToastrConfig} toastrConfig
     * @memberof DepartmentEntryComponent
     */
    constructor(
        private dataExchange: DataExchangeService<TemplateModel>,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private templateService: TemplateService,
    ) { }

    templateModel: TemplateModel;
    templateForm: FormGroup;
    private ngUnsubscribe: Subject<any> = new Subject<any>();
    public toolbarConfig: any = GlobalConstants.EditorToolbarConfig;
    public showAddText: string = "";
    showModified: Boolean = false;
    braces: string = "{{}}";


    ngOnInit(): void {
        this.resetTemplateForm();
        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.TemplateOnEditing,
            (model: TemplateModel) => {
                this.templateModel = model;
                this.mapFormWithModel(this.templateModel);
                this.showModified = true;
                window.scrollTo(0, 0);
            });
    }



    public onSubmit(): void {
        if (this.templateForm.valid) {
            let modeifiedTemplateModel = new TemplateModel();
            delete modeifiedTemplateModel.EmergencySituation;
            delete modeifiedTemplateModel.EmergencySituationId;
            delete modeifiedTemplateModel.TemplateMediaId;
            delete modeifiedTemplateModel.Active;
            delete modeifiedTemplateModel.ActiveFlag;
            delete modeifiedTemplateModel.CreatedBy;
            delete modeifiedTemplateModel.CreatedOn;

            UtilityService.setModelFromFormGroup<TemplateModel>(modeifiedTemplateModel, this.templateForm,
                (x: TemplateModel) => x.Subject,
                (x: TemplateModel) => x.Description);

            this.templateService.Update(modeifiedTemplateModel, this.templateModel.TemplateId)
                .subscribe((response: TemplateModel) => {
                    this.toastrService.success(`Template successfully updated.`, 'Success', this.toastrConfig);
                    this.templateModel.Subject = modeifiedTemplateModel.Subject;
                    this.templateModel.Description = modeifiedTemplateModel.Description;
                    this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.TemplateOnEdited, this.templateModel);
                    this.showModified = false;
                }, (error: any) => {
                    console.log(`Error: ${error.message}`);
                    if (error && error.message && error.message != '') {
                        let errMessage: String = error.message;
                        this.toastrService.error(`${errMessage.replace('|', '<br/>')}`, 'Error', this.toastrConfig);
                    }
                });
        }
    }

    public resetTemplateForm(): void {
        this.templateForm = new FormGroup({
            Subject: new FormControl('', [Validators.required]),
            Description: new FormControl('', [Validators.required])
        });
    }

    public mapFormWithModel(model: TemplateModel): void {
        this.templateForm.setValue({
            "Subject": model.Subject,
            "Description": model.Description
        });
    }

    public cancel(): void {
        this.showModified = false;


    }

    ngOnDestroy(): void {

    }

}