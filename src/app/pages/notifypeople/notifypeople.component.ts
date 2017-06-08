import { Component, ViewEncapsulation, OnInit, ElementRef, ViewChild } from '@angular/core';


import { DepartmentModel } from '../masterdata/department/components/department.model';
import { UserProfileModel } from '../masterdata/userprofile/components/userprofile.model';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
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
    treeExpanded: boolean;
    private $document: JQuery;
    private $tree: JQuery;
    public allDepartmentUserPermission: NotifyPeopleModel[] = [];
    public allDepartmentUserPermissionString: string = '';
    currentDepartmentId: number;
    currentIncidentId: number;
    public tree: any;
    public form: FormGroup;
    constructor(formBuilder: FormBuilder,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private notifyPeopleService: NotifyPeopleService,
        private elementRef: ElementRef,
        private globalState: GlobalStateService) { };


    ngOnInit(): any {
        this.treeExpanded = false;
        this.resetAdditionalForm();
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
        this.appendedTemplate = new AppendedTemplateModel();
        this.currentIncidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.PopulateNotifyDepartmentUsers(this.currentDepartmentId, this.currentIncidentId);


    }

    private resetAdditionalForm(): void {
        this.form = new FormGroup({
            AdditionalData: new FormControl('')
        });
    }
    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.PopulateNotifyDepartmentUsers(this.currentDepartmentId, this.currentIncidentId);
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
    }
    public ExpandCollapseAll(): void {
        if (this.tree != undefined) {
            this.treeExpanded = !this.treeExpanded;
            if (this.treeExpanded) {
                this.tree.expandAll();
            }
            else {
                this.tree.collapseAll();
            }
        }
    }


    public PopulateNotifyDepartmentUsers(departmentId: number, incidentId: number): void {
        this.notifyPeopleService.GetAllDepartmentMatrix(departmentId, incidentId, (result: NotifyPeopleModel[]) => {
            this.allDepartmentUserPermission = result;
            this.allDepartmentUserPermissionString = JSON.stringify(this.allDepartmentUserPermission);
            this.$tree = jQuery(this.elementRef.nativeElement).find('#tree');
            if (this.tree != undefined) {
                this.tree.destroy();
            }
            this.tree = this.$tree.tree({
                primaryKey: 'id',
                uiLibrary: 'bootstrap',
                iconsLibrary: 'fontawesome',
                dataSource: jQuery.parseJSON(this.allDepartmentUserPermissionString),//this.allDepartmentUserPermissionString,
                checkboxes: true
            })
            var node = this.tree.getNodeByText(result[0].text);
            jQuery(jQuery(jQuery(jQuery(jQuery(node[0])[0])[0])[0]).find('div')[0]).hide();
            jQuery(jQuery(jQuery(jQuery(jQuery(node[0])[0])[0])[0]).find('ul')[0]).addClass("first-row-alignment");
            this.tree.expand(node);
        });
    }

    public notify(): void {
        let checkedIds: number[] = this.tree.getCheckedNodes();
        this.notifyPeopleService.NotifyPeopleCall(checkedIds, this.currentDepartmentId, this.currentIncidentId, (item: TemplateModel) => {
            this.appendedTemplate.AppendedTemplateId = 0;
            this.appendedTemplate.TemplateId = item.TemplateId;
            this.appendedTemplate.EmergencySituationId = item.EmergencySituationId;
            this.appendedTemplate.TemplateMediaId = item.TemplateMediaId;
            this.appendedTemplate.Description = item.Description;
            this.appendedTemplate.Subject = item.Subject;
            this.appendedTemplate.ActiveFlag = 'Active';
            this.appendedTemplate.CreatedBy = +UtilityService.GetFromSession('CurrentUserId');
            this.appendedTemplate.CreatedOn = new Date();
            this.childModalNoificationMessage.hide();
        });
    }

    public hideNoificationMessage(): void {
        this.childModalNoificationMessage.hide();
    }

    public saveNotificationMessage(): void {
        let additionalData: string = this.form.controls['AdditionalData'].value;
        this.appendedTemplate.Description = this.appendedTemplate.Description + ' ' + additionalData;
        this.notifyPeopleService.CreateAppendedTemplate(this.appendedTemplate,
            this.currentIncidentId, this.currentDepartmentId, (item: boolean) => {
                if (item) {
                    this.toastrService.success('The respective user has been notified.', 'Notify User', this.toastrConfig);
                    console.log('Notify User Clicked');
                }
                else {
                    this.toastrService.error('Some Error Occured.', 'Notify User', this.toastrConfig);
                    console.log('Notify User Clicked error');
                }
            });
    }
}