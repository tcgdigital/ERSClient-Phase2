import { Component, ViewEncapsulation, OnInit, ElementRef, ViewChild } from '@angular/core';

import { DepartmentModel } from '../masterdata/department/components/department.model';
import { UserProfileModel } from '../masterdata/userprofile/components/userprofile.model';
import { NotifyPeopleService } from './components/notifypeople.service';
import { NotifyPeopleModel } from './components/notifypeople.model';
import { TemplateModel } from "../masterdata/template/components";
import { AppendedTemplateModel } from "../masterdata/appendedtemplate/components/appendedtemplate.model";
import { ModalDirective } from 'ng2-bootstrap/modal';
import {
    FormGroup, FormControl, FormBuilder, Validators,
    ReactiveFormsModule
} from '@angular/forms';
import {
    ResponseModel,
    DataExchangeService,
    UtilityService,
    AutocompleteComponent,
    GlobalStateService,
    KeyValue
} from '../../shared';

@Component({
    selector: 'notify-people-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/notifypeople.view.html',
    styleUrls: ['./styles/notifypeople.style.scss']
})
export class NotifyPeopleComponent implements OnInit {
    @ViewChild('childModalNoificationMessage') public childModalNoificationMessage: ModalDirective;
    appendedTemplate: AppendedTemplateModel;
    userProfileItems: UserProfileModel[] = [];
    departments: DepartmentModel[] = [];
    notificationModel: NotifyPeopleModel[] = [];
    private $document: JQuery;
    private $tree: JQuery;
    public allDepartmentUserPermission: NotifyPeopleModel[] = [];
    public allDepartmentUserPermissionString: string = '';
    currentDepartmentId: number;
    currentIncidentId: number;
    public tree: any;
    public form: FormGroup;
    constructor(formBuilder: FormBuilder,
        private notifyPeopleService: NotifyPeopleService,
        private elementRef: ElementRef,
        private globalState: GlobalStateService) { };

    ngOnInit(): any {
        //debugger;
        this.resetAdditionalForm();
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.globalState.Subscribe('departmentChange', (model) => this.departmentChangeHandler(model));
        this.appendedTemplate = new AppendedTemplateModel();
        this.currentIncidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.globalState.Subscribe('incidentChange', (model) => this.incidentChangeHandler(model));
        this.PopulateNotifyDepartmentUsers(this.currentDepartmentId);
    }
    private resetAdditionalForm(): void {
        this.form = new FormGroup({
            AdditionalData: new FormControl('')
        });
    }
    private departmentChangeHandler(departmentId): void {
        //debugger;
        this.currentDepartmentId = +departmentId;
        this.PopulateNotifyDepartmentUsers(this.currentDepartmentId);
    }

    private incidentChangeHandler(incidentId): void {
        //debugger;
        this.currentIncidentId = +incidentId;
        //this.PopulateNotifyDepartmentUsers(this.currentDepartmentId);
    }

    public PopulateNotifyDepartmentUsers(departmentId: number): void {
        this.notifyPeopleService.GetAllDepartmentMatrix(departmentId, (result: NotifyPeopleModel[]) => {
            debugger;
            this.allDepartmentUserPermission = result;
            this.allDepartmentUserPermissionString = JSON.stringify(this.allDepartmentUserPermission);
            this.$tree = jQuery(this.elementRef.nativeElement).find('#tree');
            debugger;
            //this.$tree.des
            let tree = this.$tree.tree({
                primaryKey: 'id',
                uiLibrary: 'bootstrap',
                iconsLibrary: 'fontawesome',
                dataSource: jQuery.parseJSON(this.allDepartmentUserPermissionString),//this.allDepartmentUserPermissionString,
                checkboxes: true,
                autoLoad: false
            })
            debugger;
            tree.reload();
        });
    }

    public notify(): void {
        debugger;
        let checkedIds: number[] = this.tree.getCheckedNodes();

        this.notifyPeopleService.NotifyPeopleCall(checkedIds, this.currentDepartmentId, this.currentIncidentId, (item: TemplateModel) => {
            debugger;
            this.appendedTemplate.AppendedTemplateId = 0;
            this.appendedTemplate.TemplateId = item.TemplateId;
            this.appendedTemplate.EmergencySituationId = item.EmergencySituationId;
            this.appendedTemplate.TemplateMediaId = item.TemplateMediaId;
            this.appendedTemplate.Description = item.Description;
            this.appendedTemplate.Subject = item.Subject;
            this.appendedTemplate.ActiveFlag = 'Active';
            this.appendedTemplate.CreatedBy=+UtilityService.GetFromSession('CurrentUserId');
            this.appendedTemplate.CreatedOn=new Date();
            debugger;
            this.childModalNoificationMessage.show();
        });
    }

    public hideNoificationMessage(): void {
        this.childModalNoificationMessage.hide();
    }

    public saveNotificationMessage(): void {
        debugger;
        let additionalData: string = this.form.controls['AdditionalData'].value;
        this.appendedTemplate.Description = this.appendedTemplate.Description+' '+additionalData;
        this.notifyPeopleService.CreateAppendedTemplate(this.appendedTemplate,
        this.currentIncidentId,this.currentDepartmentId);
    }
}