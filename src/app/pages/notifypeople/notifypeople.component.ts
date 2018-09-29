import {
    Component, ViewEncapsulation,
    OnInit, ElementRef, ViewChild
} from '@angular/core';
import { DepartmentModel } from '../masterdata/department';
import { UserProfileModel } from '../masterdata/userprofile';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { NotifyPeopleService } from './components/notifypeople.service';
import { NotifyPeopleModel, MessageTemplate } from './components/notifypeople.model';
import { TemplateModel } from '../masterdata/template/components';
import { AppendedTemplateModel } from '../masterdata/appendedtemplate';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {
    FormGroup, FormControl, FormBuilder, Validators
} from '@angular/forms';
import {
    UtilityService, GlobalStateService,
    KeyValue, GlobalConstants, ResponseModel, TemplateMediaType, EmergencySituation
} from '../../shared';
import { UserPermissionService, UserPermissionModel } from '../masterdata';
import { Observable } from 'rxjs';

@Component({
    selector: 'notify-people-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/notifypeople.view.html',
    styleUrls: ['./styles/notifypeople.style.scss']
})
export class NotifyPeopleComponent implements OnInit {
    @ViewChild('childModalEventNoificationMessage') public childModalEventNoificationMessage: ModalDirective;
    @ViewChild('childModalCustomNoificationMessage') public childModalCustomNoificationMessage: ModalDirective;

    public appendedTemplate: AppendedTemplateModel;
    public userProfileItems: UserProfileModel[] = [];
    public departments: DepartmentModel[] = [];
    public notificationModel: NotifyPeopleModel[] = [];
    public currentUserId: number;
    public userAllocatedDepartments: any[] = [];
    public allDepartmentUserPermission: NotifyPeopleModel[] = [];
    public allDepartmentUserPermissionString: string = '';
    public tree: any;
    public eventMessageForm: FormGroup;
    public customMessageForm: FormGroup;
    private $tree: JQuery;
    public isShowPage: boolean = true;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;
    public dropdownList = [];
    public selectedItems = [];
    public multiselectSettings: any = {};

    currentDepartmentId: number;
    currentIncidentId: number;
    treeExpanded: boolean;

    constructor(private formBuilder: FormBuilder,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private notifyPeopleService: NotifyPeopleService,
        private elementRef: ElementRef,
        private userPermissionService: UserPermissionService,
        private globalState: GlobalStateService) {
    }

    public ngOnInit(): any {
        this.treeExpanded = false;
        this.resetNotificationForm();
        this.appendedTemplate = new AppendedTemplateModel();

        this.currentUserId = +UtilityService.GetFromSession('CurrentUserId');
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange,
            (model: KeyValue) => this.departmentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChange,
            (model: KeyValue) => this.incidentChangeHandler(model));

        if (UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'NotifyPeople'))
            this.PopulateNotifyDepartmentUsers(this.currentDepartmentId, this.currentIncidentId);

        this.multiselectSettings = {
            singleSelection: false,
            text: "Select Countries",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            classes: "myclass custom-class"
        };

        this.GetUserDepartments();
    }

    public ExpandCollapseAll(): void {
        if (this.tree !== undefined) {
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
        this.notifyPeopleService.GetAllDepartmentMatrix
            (departmentId, incidentId, (result: NotifyPeopleModel[]) => {
                let currentDeptItem: NotifyPeopleModel;

                currentDeptItem = result.find(x => x.DepartmentId == departmentId);
                result = result.filter(x => x.DepartmentId != departmentId);

                result.sort(function (a, b) {
                    return (a.text.toUpperCase() > b.text.toUpperCase()) ? 1
                        : ((b.text.toUpperCase() > a.text.toUpperCase()) ? -1 : 0);
                });
                result.unshift(currentDeptItem);

                result.forEach(x => {
                    if (x.children.length > 0) {
                        x.children.forEach(y => {
                            y.text = y.User.Name + " (" + y.User.Email + ")";
                            if (y.population == 'true') {
                                y.text = y.text + "<i class='fa fa-user-circle-o ml-1 hod-marked'></i>";
                            }
                        });

                        x.children.sort(function (a, b) {
                            return (a.text.toUpperCase() > b.text.toUpperCase()) ? 1
                                : ((b.text.toUpperCase() > a.text.toUpperCase()) ? -1 : 0);
                        });
                    }
                })

                this.allDepartmentUserPermission = result;
                this.$tree = jQuery(this.elementRef.nativeElement).find('#tree');

                if (this.tree !== undefined) {
                    this.tree.destroy();
                }

                this.tree = this.$tree.tree({
                    primaryKey: 'id',
                    uiLibrary: 'bootstrap4',
                    iconsLibrary: 'fontawesome',
                    dataSource: this.allDepartmentUserPermission,
                    checkboxes: true,
                    icons: {
                        expand: '<i class="fa fa-chevron-right" aria-hidden="true"></i>',
                        collapse: '<i class="fa fa-chevron-down" aria-hidden="true"></i>'
                    }
                });

                const node = this.tree.getNodeById(result[0].id);
                jQuery('#tree ul.gj-tree-bootstrap-list li ul.gj-tree-bootstrap-list:eq(0)').addClass('first-row-alignment');
                this.tree.expand(node);
            });
    }

    public notify(): void {
        const checkedIds: number[] = this.tree.getCheckedNodes();

        if (checkedIds.length > 0) {
            this.notifyPeopleService.NotifyPeopleCall
                (checkedIds, this.currentDepartmentId, this.currentIncidentId,
                EmergencySituation.EmergencyInitiationtoTeamMember, TemplateMediaType.Email,
                (item: TemplateModel) => {
                    this.SetTemplateObject(item);
                    this.childModalEventNoificationMessage.show();
                });
        } else {
            this.toastrService.error('Select at least one user before click "Notify On Event".', 'Notify User', this.toastrConfig);
        }
    }

    public notifyMessage(): void {
        const checkedIds: number[] = this.tree.getCheckedNodes();

        if (checkedIds.length > 0) {
            this.notifyPeopleService.NotifyPeopleCall
                (checkedIds, this.currentDepartmentId, this.currentIncidentId,
                EmergencySituation.GeneralNotification, TemplateMediaType.Email,
                (item: TemplateModel) => {
                    this.SetTemplateObject(item);
                    this.customMessageForm.patchValue({
                        MessageData: item.Description
                    });
                    this.childModalCustomNoificationMessage.show();
                });
        } else {
            this.toastrService.error('Select at least one user before click "Notify Message".', 'Notify User', this.toastrConfig);
        }
    }

    private SetTemplateObject(item: TemplateModel): void {
        this.appendedTemplate.AppendedTemplateId = 0;
        this.appendedTemplate.TemplateId = item.TemplateId;
        this.appendedTemplate.EmergencySituationId = item.EmergencySituationId;
        this.appendedTemplate.TemplateMediaId = item.TemplateMediaId;
        this.appendedTemplate.Description = item.Description;
        this.appendedTemplate.Subject = item.Subject;
        this.appendedTemplate.ActiveFlag = 'Active';
        this.appendedTemplate.CreatedBy = +UtilityService.GetFromSession('CurrentUserId');
        this.appendedTemplate.CreatedOn = new Date();
    }

    public hideEventNoificationMessage(): void {
        this.childModalEventNoificationMessage.hide();
    }

    public hideCustomNoificationMessage(): void {
        this.childModalCustomNoificationMessage.hide();
    }

    public saveNotificationMessage(): void {
        const additionalData: string = this.eventMessageForm.controls['AdditionalData'].value;
        this.appendedTemplate.Description = `${this.appendedTemplate.Description} ${additionalData}`;
        this.saveNotificationProcess(() => {
            this.hideEventNoificationMessage();
        });
    }

    public saveCustomNotificationMessage(formData: any): void {
        this.appendedTemplate.Description = this.customMessageForm.controls['MessageData'].value;
        this.saveNotificationProcess(() => {
            this.hideCustomNoificationMessage();
        });
    }

    public saveNotificationProcess(callback?: (() => void)): void {
        this.notifyPeopleService.CreateAppendedTemplate(this.appendedTemplate,
            this.currentIncidentId, this.currentDepartmentId, (item: boolean) => {
                if (item) {
                    if (callback) callback()
                    this.toastrService.success('The respective user has been notified.', 'Notify User', this.toastrConfig);
                    console.log('Notify User Clicked');
                }
                else {
                    this.toastrService.error('Some Error Occured.', 'Notify User', this.toastrConfig);
                    console.log('Notify User Clicked error');
                }
            });
    }

    private resetNotificationForm(): void {
        this.eventMessageForm = this.formBuilder.group({
            AdditionalData: new FormControl('', [Validators.required, Validators.maxLength(1000)])
        });

        this.customMessageForm = this.formBuilder.group({
            MessageData: new FormControl('', [Validators.required, Validators.maxLength(1000)])
        })
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        if (UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'NotifyPeople'))
            this.PopulateNotifyDepartmentUsers(this.currentDepartmentId, this.currentIncidentId);
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
    }

    private GetUserDepartments(): void {
        this.userPermissionService.GetAllDepartmentsAssignedToUser(this.currentUserId)
            .map((x: ResponseModel<UserPermissionModel>) => x.Records.sort((a, b) => {
                if (a.Department.DepartmentName.trim().toLowerCase() < b.Department.DepartmentName.trim().toLowerCase()) return -1;
                if (a.Department.DepartmentName.trim().toLowerCase() > b.Department.DepartmentName.trim().toLowerCase()) return 1;
                return 0;
            }))
            .subscribe((userPermissions: UserPermissionModel[]) => {
                this.userAllocatedDepartments = userPermissions
                    .map((userPermission: UserPermissionModel) => ({
                        id: userPermission.Department.DepartmentId,
                        itemName: userPermission.Department.DepartmentName
                    }));

                if (this.userAllocatedDepartments.length > 0) {
                    this.selectedItems = this.userAllocatedDepartments
                        .filter(x => x.id == this.currentDepartmentId);
                }
            });
    }
}