import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import * as _ from 'underscore';
import { Observable } from 'rxjs/Observable';
import { ConnectionStarter, CallbackListner } from './page.model';
import {
    SideMenuService, KeyValue,
    ResponseModel, GlobalStateService, StorageType, GlobalConstants, BaseModel
} from '../shared';
import { DepartmentService, DepartmentModel } from './masterdata';
import { IncidentService, IncidentModel } from './incident';
import { PAGES_MENU } from './pages.menu';
import { UtilityService } from '../shared/services';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthenticationService } from './login/components/authentication.service';
import { UserPermissionService } from './masterdata/userpermission/components';
import { UserPermissionModel } from './masterdata/userpermission/components';
import {
    NotificationConnection, BroadcastEventListener,
    NotificationBroadcastService, ConnectionConfig,
    INotificationConnection
} from '../shared/services/notification.services';
import { BroadCastModel } from './shared.components/broadcast';
import { CasualtyExchangeModel } from './widgets/casualty.summary.widget';
import { ActionableModel } from './shared.components/actionables';
import { DemandModel } from './shared.components/demand';
import { MediaModel } from './shared.components/media';
import { EnquiryModel } from './shared.components/call.centre';
import { ExternalInputModel } from './callcenteronlypage';
import { PresidentMessageModel } from './shared.components/presidentMessage';
import { PresidentMessageWidgetModel } from './widgets/presidentMessage.widget';
import { MediaReleaseWidgetModel } from './widgets/mediaRelease.widget';

@Component({
    selector: 'pages',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './pages.view.html',
    providers: []
})
export class PagesComponent implements OnInit {
    @ViewChild('changePasswordModel') public changePasswordModel: ModalDirective;
    @ViewChild('quickLinkModel') public quickLinkModel: ModalDirective;

    sideMenuState: boolean = false;
    departments: KeyValue[] = [];
    incidents: KeyValue[] = [];
    incidentOrganizations: KeyValue[] = [];
    currentDepartmentId: number = 0;
    currentIncidentId: number = 0;
    userName: string;
    lastLogin: Date;
    userId: number;
    isLanding: boolean = false;
    showQuicklink: boolean = false;
    connectionStaters: ConnectionStarter[];

    private sub: any;

    private _userRegistrationHubConnection: NotificationConnection;

    /**
     * Creates an instance of PagesComponent.
     * @param {SideMenuService} sideMenuService
     * @param {IncidentService} incidentService
     * @param {DepartmentService} departmentService
     * @param {GlobalStateService} globalState
     * @param {ToastrService} toastrService
     * @param {ToastrConfig} toastrConfig
     *
     * @memberOf PagesComponent
     */
    constructor(private router: Router,
        private sideMenuService: SideMenuService,
        private incidentService: IncidentService,
        private departmentService: DepartmentService,
        private userPermissionService: UserPermissionService,
        private authenticationService: AuthenticationService,
        private globalState: GlobalStateService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private route: ActivatedRoute,
        private broadcastMessageNotificationHub: NotificationBroadcastService,
        private casualtyStatusUpdateNotificationHub: NotificationBroadcastService,
        private checklistSubmissionNotificationHub: NotificationBroadcastService,
        private crisisClosureNotificationHub: NotificationBroadcastService,
        private crisisCreationNotificationHub: NotificationBroadcastService,
        private demandSubmissionNotificationHub: NotificationBroadcastService,
        private presidentsMessageAndMediaReleaseNotificationHub: NotificationBroadcastService,
        private presidentAndMediaWorkflowNotificationHub: NotificationBroadcastService,
        private queryNotificationHub: NotificationBroadcastService) {
        toastrConfig.closeButton = true;
        toastrConfig.progressBar = true;
        toastrConfig.enableHtml = true;
    }

    ngOnInit(): void {
        this.sideMenuService.updateMenuByRoutes(PAGES_MENU as Routes);
        this.userName = UtilityService.GetFromSession('CurrentLoggedInUserName', StorageType.LocalStorage);
        this.userId = +UtilityService.GetFromSession('CurrentUserId');
        this.lastLogin = new Date(UtilityService.GetFromSession('LastLoginTime', StorageType.LocalStorage));

        const local_incidents: Observable<IncidentModel[]> = this.GetIncidents();
        const local_departments: Observable<UserPermissionModel[]> = this.GetUserDepartments();
        this.ProcessData(() => {
            this.globalState.Subscribe('incidentCreate', (model: number) => this.incidentCreateHandler(model));
            this.initiateHubConnections();
            // this.PrepareConnectionAndCall(this.currentIncidentId, this.currentDepartmentId);
        }, local_incidents, local_departments);

        // this.getIncidents();
        // this.getDepartments();
    }

    ngOnDestroy(): void {
        //  this.globalState.Unsubscribe('incidentCreate');
    }

    public toggleSideMenu($event): void {
        this.sideMenuState = !this.sideMenuState;
    }

    public onContactClicked($event): void {
        this.globalState.NotifyDataChanged('contactClicked', '');
    }

    public onHelpClicked($event): void {
        this.toastrService.info('Help command has been clicked', 'Help', this.toastrConfig);
        console.log('Help Clicked');
    }

    public onLogoutClicked($event): void {
        this.authenticationService.Logout();
        this.router.navigate(['login']);
    }

    public onChangePasswordClicked($event): void {
        this.changePasswordModel.show();
    }

    public closeChangePasswordModal(): void {
        this.changePasswordModel.hide();
    }

    public onCancelChangePasswordClick($event): void {
        this.changePasswordModel.hide();
    }

    public onChangePasswordSuccess($event): void {
        this.toastrService.success($event, 'Password Changed', this.toastrConfig);
        this.authenticationService.Logout();
        this.router.navigate(['login']);
    }

    public closeQuickLinkModel(): void {
        this.quickLinkModel.hide();
        this.showQuicklink = false;
    }

    public onDepartmentChange(selectedDepartment: KeyValue): void {
        UtilityService.SetToSession({ CurrentDepartmentId: selectedDepartment.Value });
        this.currentDepartmentId = selectedDepartment.Value;
        this.globalState.NotifyDataChanged('departmentChange', selectedDepartment);
        // this.PrepareConnectionAndCall(this.currentIncidentId, this.currentDepartmentId);
    }

    public onIncidentChange(selectedIncident: KeyValue): void {
        UtilityService.SetToSession({ CurrentIncidentId: selectedIncident.Value });
        this.currentIncidentId = selectedIncident.Value;
        UtilityService.SetToSession({
            CurrentOrganizationId: this.incidentOrganizations
                .find((z) => z.Key === selectedIncident.Value.toString()).Value
        });
        this.globalState.NotifyDataChanged('incidentChange', selectedIncident);
        // this.PrepareConnectionAndCall(this.currentIncidentId, this.currentDepartmentId);
    }

    public onMenuClick($event): void {
        this.showQuicklink = true;
        if ($event === 'quicklink') {
            this.quickLinkModel.show();
        }
    }

    private getDepartments(): void {
        this.userPermissionService.GetAllDepartmentsAssignedToUser(this.userId)
            .map((x: ResponseModel<UserPermissionModel>) => x.Records.sort((a, b) => {
                if (a.Department.DepartmentName < b.Department.DepartmentName) return -1;
                if (a.Department.DepartmentName > b.Department.DepartmentName) return 1;
                return 0;
            })
            ).subscribe((x: UserPermissionModel[]) => {
                this.departments = x.map((y: UserPermissionModel) =>
                    new KeyValue(y.Department.DepartmentName, y.Department.DepartmentId));
                if (this.departments.length > 0) {
                    const departmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
                    if (departmentId > 0) {
                        this.currentDepartmentId = departmentId;
                    }
                    else {
                        this.currentDepartmentId = this.departments[0].Value;
                        UtilityService.SetToSession({ CurrentDepartmentId: this.currentDepartmentId });
                    }
                    console.log(this.currentDepartmentId);
                }
                else {
                    // this.isLanding = true;
                }
            });
    }

    private getIncidents(): void {
        this.incidentService.GetAllActiveIncidents()
            .map((x: ResponseModel<IncidentModel>) => x.Records.sort((a, b) => {
                const dateA = new Date(a.CreatedOn).getTime();
                const dateB = new Date(b.CreatedOn).getTime();
                return dateA > dateB ? -1 : 1;
            })).subscribe((x: IncidentModel[]) => {
                this.incidents = x.map((y: IncidentModel) => new KeyValue(y.EmergencyName, y.IncidentId));
                this.incidentOrganizations = x.map((y: IncidentModel) => new KeyValue(y.IncidentId.toString(), y.OrganizationId));
                if (this.incidents.length > 0) {
                    const incidentId = +UtilityService.GetFromSession('CurrentIncidentId');

                    if (incidentId > 0) {
                        this.currentIncidentId = incidentId;
                    }
                    else {
                        this.currentIncidentId = this.incidents[0].Value;
                        UtilityService.SetToSession({ CurrentIncidentId: this.currentIncidentId });
                    }
                    UtilityService.SetToSession({
                        CurrentOrganizationId: this.incidentOrganizations
                            .find((z) => z.Key === this.currentIncidentId.toString()).Value
                    });
                    console.log(this.currentIncidentId);

                    this.isLanding = false;
                }
                else {
                    this.isLanding = true;
                }
            });
    }


    private GetIncidents(): Observable<IncidentModel[]> {
        return this.incidentService.GetAllActiveIncidents()
            .map((x: ResponseModel<IncidentModel>) => x.Records.sort((a, b) => {
                const dateA = new Date(a.CreatedOn).getTime();
                const dateB = new Date(b.CreatedOn).getTime();
                return dateA > dateB ? -1 : 1;
            }));
    }

    private GetUserDepartments(): Observable<UserPermissionModel[]> {
        return this.userPermissionService.GetAllDepartmentsAssignedToUser(this.userId)
            .map((x: ResponseModel<UserPermissionModel>) => x.Records.sort((a, b) => {
                if (a.Department.DepartmentName < b.Department.DepartmentName) return -1;
                if (a.Department.DepartmentName > b.Department.DepartmentName) return 1;
                return 0;
            }));
    }

    private ProcessData(callback: () => void, ...observables: Array<Observable<any[]>>): void {
        // debugger;
        Observable.forkJoin(observables).subscribe((res: any[]) => {
            if (res && res.length > 0) {
                if (res[0].length > 0 && _.all(res[0], (x) => _.some(Object.keys(x), (y) => y === 'EmergencyTypeId'))) {
                    this.ProcessIncidents(res[0] as IncidentModel[]);
                }
                if (res[1].length > 0 && _.all(res[1], (x) => _.some(Object.keys(x), (y) => y === 'UserPermissionId'))) {
                    this.ProcessUserDepartments(res[1] as UserPermissionModel[]);
                }
                callback();
            }
        });
    }

    private ProcessIncidents(incidents: IncidentModel[]): void {
        if (incidents.length > 0) {
            this.incidents = incidents.map((y: IncidentModel) => new KeyValue(y.EmergencyName, y.IncidentId));
            this.incidentOrganizations = incidents.map((y: IncidentModel) => new KeyValue(y.IncidentId.toString(), y.OrganizationId));
            const incidentId: number = +UtilityService.GetFromSession('CurrentIncidentId');

            if (incidentId > 0 && !isNaN(incidentId)) {
                this.currentIncidentId = incidentId;
            }
            else {
                this.currentIncidentId = this.incidents[0].Value;
                UtilityService.SetToSession({ CurrentIncidentId: this.currentIncidentId });
            }
            UtilityService.SetToSession({
                CurrentOrganizationId: this.incidentOrganizations
                    .find((z) => z.Key === this.currentIncidentId.toString()).Value
            });
            this.isLanding = false;
        }
        else {
            this.isLanding = true;
        }
    }

    private ProcessUserDepartments(userDepartments: UserPermissionModel[]): void {
        if (userDepartments.length > 0) {
            this.departments = userDepartments.map((y: UserPermissionModel) =>
                new KeyValue(y.Department.DepartmentName, y.Department.DepartmentId));
            const departmentId = +UtilityService.GetFromSession('CurrentDepartmentId');

            if (departmentId > 0 && !isNaN(departmentId)) {
                this.currentDepartmentId = departmentId;
            }
            else {
                this.currentDepartmentId = this.departments[0].Value;
                UtilityService.SetToSession({ CurrentDepartmentId: this.currentDepartmentId });
            }
            console.log(this.currentDepartmentId);
        }
    }

    private incidentCreateHandler(incident: number) {
        this.getIncidents();
    }

    private initiateHubConnections(): void {
        this._userRegistrationHubConnection = this.route.snapshot.data['UserRegistrationHubConnection'];
    }

    private PrepareConnectionAndCall(incId: number, deptId: number) {
        this.CloseConnection();
        this.connectionStaters = new Array<ConnectionStarter>();

        const broadcastNotificationResponse: string[] = ['ReceiveBroadcastCreationResponse', 'ReceiveBroadcastModificationResponse'];
        const presidentMessageNotificationResponse: string[] = ['ReceivePresidentsMessageResponse'];
        const presidentMessageWorkflowResponse: string[] = ['ReceivePresidentsMessageCreatedResponse',
            'ReceivePresidentsMessageSendForApprovalResponse', 'ReceivePresidentsMessageApprovedResponse',
            'ReceivePresidentsMessageRejectedResponse', 'ReceivePresidentsMessagePublishedResponse', 'ReceivePresidentsMessageUpdateResponse'];

        const mediaMessageNotificationResponse: string[] = ['ReceiveMediaMessageResponse'];
        const mediaMessageWorkflowResponse: string[] = ['ReceiveMediaMessageCreatedResponse',
            'ReceiveMediaMessageSendForApprovalResponse', 'ReceiveMediaMessageApprovedResponse',
            'ReceiveMediaMessageRejectedResponse', 'ReceiveMediaMessagePublishedResponse', 'ReceiveMediaMessageUpdateResponse'];

        const casualtyNotificationResponse: string[] = ['ReceiveCasualtyCountResponse'];
        const checklistNotificationResponse: string[] = ['ReceiveChecklistCreationResponse',
            'ReceiveChecklistActivationResponse', 'ReceiveChecklistClosureResponse', 'ReceiveChecklistStatusChangeResponse'];
        const crisisCreationNotificationResponse: string[] = ['ReceiveCrisisCreationResponse'];
        const crisisClosureNotificationResponse: string[] = ['ReceiveCrisisClosureResponse'];
        const mediaNotificationResponse: string[] = ['ReceiveMediaMessageResponse', 'ReceivePresidentsMessageResponse'];
        const dimandNotificationResponse: string[] = ['ReceiveDemandCreationResponse', 'ReceiveDemandAssignedResponse',
            'ReceiveCompletedDemandAssignedResponse', 'ReceiveDemandApprovalPendingResponse', 'ReceiveDemandApprovedResponse',
            'ReceiveDemandClosedResponse', 'ReceiveDemandStatusUpdateResponse', 'ReceiveCompletedDemandstoCloseResponse',
            'ReceiveRejectedDemandstoAssignResponse'];
        const queryNotificationResponse: string[] = ['ReceiveCargoEnquiryCreationResponse', 'ReceiveCrewEnquiryCreationResponse',
            'ReceiveMediaEnquiryCreationResponse', 'ReceiveOtherEnquiryCreationResponse', 'ReceivePassangerEnquiryCreationResponse',
            'ReceiveFutureTravelEnquiryCreationResponse', 'ReceiveGeneralUpdateEnquiryCreationResponse',
            'ReceiveSituationalEnquiryCreationResponse', 'ReceiveCustomerDissatisfactionEnquiryCreationResponse',
            'AssignedCargoEnquiryCreationResponse', 'AssignedCrewEnquiryCreationResponse',
            'AssignedMediaEnquiryCreationResponse', 'AssignedOtherEnquiryCreationResponse', 'AssignedPassangerEnquiryCreationResponse',
            'AssignedFutureTravelEnquiryCreationResponse', 'AssignedGeneralUpdateEnquiryCreationResponse',
            'AssignedSituationalEnquiryCreationResponse', 'AssignedCustomerDissatisfactionEnquiryCreationResponse'];

        const callbackListners: <T extends BaseModel>(keys: string[]) => CallbackListner[] =
            <T extends BaseModel>(keys: string[]) => {
                return GlobalConstants.NotificationMessage
                    .filter((x) => keys.some((y) => y === x.Key))
                    .map((z) => new CallbackListner(z.Key, (data: T) => { showMessage(z.Key, data); }));
            };

        const showMessage: <T extends BaseModel>(key: string, model: T) => void =
            <T extends BaseModel>(key: string, model: T) => {
                const message = GlobalConstants.NotificationMessage.find((x) => x.Key === key);
                if (message.Title !== '' && message.Message !== '')
                    this.toastrService.info(message.Message, message.Title);
                this.globalState.NotifyDataChanged(key, model);
            };

        /*this.connectionStaters.push(new ConnectionStarter(this.broadcastMessageNotificationHub,
            'BroadcastMessageNotificationHub', {
                departmentId: deptId, incidentId: incId
            }, callbackListners<BroadCastModel>(broadcastNotificationResponse)
        ));

        this.connectionStaters.push(new ConnectionStarter(this.casualtyStatusUpdateNotificationHub,
            'CasualtyStatusUpdateNotificationHub', {
                incidentId: incId
            }, callbackListners<CasualtyExchangeModel>(casualtyNotificationResponse)
        ));*/

        // this.connectionStaters.push(new ConnectionStarter(this.checklistSubmissionNotificationHub,
        //     'ChecklistSubmissionNotificationHub', {
        //         departmentId: deptId, incidentId: incId
        //     }, callbackListners<ActionableModel>(checklistNotificationResponse)
        // ));

        /*this.connectionStaters.push(new ConnectionStarter(this.crisisClosureNotificationHub,
            'CrisisClosureNotificationHub', {
                incidentId: incId
            }, callbackListners<IncidentModel>(crisisClosureNotificationResponse)
        ));

        this.connectionStaters.push(new ConnectionStarter(this.crisisCreationNotificationHub,
            'CrisisCreationNotificationHub', null, callbackListners<IncidentModel>(crisisCreationNotificationResponse)
        ));*/

        this.connectionStaters.push(new ConnectionStarter(this.demandSubmissionNotificationHub,
            'DemandSubmissionNotificationHub', {
                departmentId: deptId, incidentId: incId
            }, callbackListners<DemandModel>(dimandNotificationResponse)
        ));

        /*this.connectionStaters.push(new ConnectionStarter(this.presidentsMessageAndMediaReleaseNotificationHub,
            'PresidentsMessageAndMediaReleaseNotificationHub', {
                incidentId: incId
            }, callbackListners<MediaModel>(mediaNotificationResponse)
        ));*/

        this.connectionStaters.push(new ConnectionStarter(this.presidentsMessageAndMediaReleaseNotificationHub,
            'PresidentsMessageAndMediaReleaseNotificationHub', {
                incidentId: incId
            }, callbackListners<PresidentMessageWidgetModel>(presidentMessageNotificationResponse)
        ));

        this.connectionStaters.push(new ConnectionStarter(this.presidentAndMediaWorkflowNotificationHub,
            'PresidentAndMediaWorkflowNotificationHub', {
                departmentId: deptId, incidentId: incId
            }, callbackListners<PresidentMessageModel>(presidentMessageWorkflowResponse)
        ));

        this.connectionStaters.push(new ConnectionStarter(this.presidentsMessageAndMediaReleaseNotificationHub,
            'PresidentsMessageAndMediaReleaseNotificationHub', {
                incidentId: incId
            }, callbackListners<MediaReleaseWidgetModel>(mediaMessageNotificationResponse)
        ));

        this.connectionStaters.push(new ConnectionStarter(this.presidentAndMediaWorkflowNotificationHub,
            'PresidentAndMediaWorkflowNotificationHub', {
                departmentId: deptId, incidentId: incId
            }, callbackListners<MediaModel>(mediaMessageWorkflowResponse)
        ));

        this.connectionStaters.push(new ConnectionStarter(this.queryNotificationHub,
            'QueryNotificationHub', {
                incidentId: incId
            }, callbackListners<ExternalInputModel>(queryNotificationResponse)
        ));

        this.ConnectAndListen(this.connectionStaters);
    }

    private CloseConnection(): void {
        try {
            // debugger;
            if (this.connectionStaters !== undefined && this.connectionStaters.length > 0) {
                this.connectionStaters.forEach((x: ConnectionStarter) => {
                    // debugger;
                    if (x.Connection)
                        x.Connection.stop();
                    x.Connection = null;
                    x.Callbacks = null;
                });
                this.connectionStaters = null;
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    private ConnectAndListen(connectionStaters: ConnectionStarter[]): void {
        // debugger;
        connectionStaters.forEach((x) => {
            x.HubConnection.createConnection({
                hubName: x.HubName,
                qs: x.QuesyString
            }).start().then((c: INotificationConnection) => {
                x.Connection = c;
                x.Callbacks.forEach((y) => {
                    c.listenFor<any>(y.Listner).subscribe((s) => {
                        y.Callback(s);
                    });
                });
            });
        });
    }
}