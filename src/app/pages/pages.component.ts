import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import * as _ from 'underscore';
import { Observable } from 'rxjs/Observable';
import { ConnectionStarter, CallbackHandler } from './page.model';
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

        // private notificationProviderService: NotificationProviderService
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
        // this.connectionStaters = new Array<ConnectionStarter>();
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

            // this.notificationProviderService.PrepareConnectionAndCall(this.currentIncidentId, this.currentDepartmentId);
            this.PrepareConnectionAndCall(this.currentIncidentId, this.currentDepartmentId);
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

        this.PrepareConnectionAndCall(this.currentIncidentId, this.currentDepartmentId);
        // this.notificationProviderService.PrepareConnectionAndCall(this.currentIncidentId, this.currentDepartmentId);
    }

    public onIncidentChange(selectedIncident: KeyValue): void {
        UtilityService.SetToSession({ CurrentIncidentId: selectedIncident.Value });
        this.currentIncidentId = selectedIncident.Value;
        UtilityService.SetToSession({
            CurrentOrganizationId: this.incidentOrganizations
                .find((z) => z.Key === selectedIncident.Value.toString()).Value
        });
        this.globalState.NotifyDataChanged('incidentChange', selectedIncident);

        this.PrepareConnectionAndCall(this.currentIncidentId, this.currentDepartmentId);
        // this.notificationProviderService.PrepareConnectionAndCall(this.currentIncidentId, this.currentDepartmentId);
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

    /**
     * Prepare notification objects with hub name and callback server events
     *
     * @private
     * @param {number} incId
     * @param {number} deptId
     * @memberof PagesComponent
     */
    private PrepareConnectionAndCall(incId: number, deptId: number) {
        if (this.connectionStaters === undefined || this.connectionStaters.length === 0) {
            this.connectionStaters = new Array<ConnectionStarter>();

            // this.connectionStaters.push(new ConnectionStarter(this.broadcastMessageNotificationHub,
            //     'BroadcastMessageNotificationHub', {
            //         departmentId: deptId, incidentId: incId
            //     }, this.GenerateCallbackHandler<BroadCastModel>('BroadcastNotification')
            // ));

            // this.connectionStaters.push(new ConnectionStarter(this.casualtyStatusUpdateNotificationHub,
            //     'CasualtyStatusUpdateNotificationHub', {
            //         incidentId: incId
            //     }, this.GenerateCallbackHandler<CasualtyExchangeModel>('CasualtyNotification')
            // ));

            // this.connectionStaters.push(new ConnectionStarter(this.checklistSubmissionNotificationHub,
            //     'ChecklistSubmissionNotificationHub', {
            //         departmentId: deptId, incidentId: incId
            //     }, this.GenerateCallbackHandler<ActionableModel>('ChecklistNotification')
            // ));

            // this.connectionStaters.push(new ConnectionStarter(this.crisisClosureNotificationHub,
            //     'CrisisClosureNotificationHub', {
            //         incidentId: incId
            //     }, this.GenerateCallbackHandler<IncidentModel>('CrisisClosureNotification')
            // ));

            // this.connectionStaters.push(new ConnectionStarter(this.crisisCreationNotificationHub,
            //     'CrisisCreationNotificationHub', null,
            //     this.GenerateCallbackHandler<IncidentModel>('CrisisCreationNotification')
            // ));

            this.connectionStaters.push(new ConnectionStarter(this.demandSubmissionNotificationHub,
                'DemandSubmissionNotificationHub', {
                    departmentId: deptId, incidentId: incId
                }, this.GenerateCallbackHandler<DemandModel>('DemandNotification')
            ));

            // this.connectionStaters.push(new ConnectionStarter(this.presidentsMessageAndMediaReleaseNotificationHub,
            //     'PresidentsMessageAndMediaReleaseNotificationHub', {
            //         incidentId: incId
            //     }, this.GenerateCallbackHandler<PresidentMessageWidgetModel>('PresidentsMessageNotification')
            // ));

            // this.connectionStaters.push(new ConnectionStarter(this.presidentAndMediaWorkflowNotificationHub,
            //     'PresidentAndMediaWorkflowNotificationHub', {
            //         departmentId: deptId, incidentId: incId
            //     }, this.GenerateCallbackHandler<PresidentMessageModel>('PresidentsMessageWorkflowNotification')
            // ));

            // this.connectionStaters.push(new ConnectionStarter(this.presidentsMessageAndMediaReleaseNotificationHub,
            //     'PresidentsMessageAndMediaReleaseNotificationHub', {
            //         incidentId: incId
            //     }, this.GenerateCallbackHandler<MediaReleaseWidgetModel>('MediaMessageNotification')
            // ));

            // this.connectionStaters.push(new ConnectionStarter(this.presidentAndMediaWorkflowNotificationHub,
            //     'PresidentAndMediaWorkflowNotificationHub', {
            //         departmentId: deptId, incidentId: incId
            //     }, this.GenerateCallbackHandler<MediaModel>('MediaMessageWorkflowNotification')
            // ));

            // this.connectionStaters.push(new ConnectionStarter(this.queryNotificationHub,
            //     'QueryNotificationHub', {
            //         incidentId: incId
            //     }, this.GenerateCallbackHandler<ExternalInputModel>('EnquiryNotification')
            // ));

            this.ConnectAndListen(this.connectionStaters);
        }
        else {
            this.connectionStaters.forEach((store: ConnectionStarter) => {
                if (store.Connection) {
                    Object.getOwnPropertyNames(store.QuesyString).forEach((x: string) => {
                        if (x === 'departmentId')
                            store.QuesyString[x] = deptId;
                        else if (x === 'incidentId')
                            store.QuesyString[x] = incId;
                    });

                    store.Connection.reconnect(store, this.ListenCallbacks);
                }
            });
        }
    }

    private CloseConnection(): void {
        try {
            if (this.connectionStaters !== undefined && this.connectionStaters.length > 0) {
                this.connectionStaters.forEach((x: ConnectionStarter) => {
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

    /**
     * Connect notification hub and call listner to listen server event
     * This function will call first time to for registered hub connections
     * @private
     * @param {ConnectionStarter[]} connectionStaters
     * @memberof PagesComponent
     */
    private ConnectAndListen(connectionStaters: ConnectionStarter[]): void {
        connectionStaters.forEach((x: ConnectionStarter) => {
            x.HubConnection.createConnection({
                hubName: x.HubName,
                qs: x.QuesyString
            }).start().then((c: INotificationConnection) => {
                this.ListenCallbacks(c, x);
            });
        });
    }

    /**
     * Listning server callback events on every SignalR connection start event
     *
     * @private
     * @param {INotificationConnection} c
     * @param {ConnectionStarter} x
     * @memberof PagesComponent
     */
    private ListenCallbacks(notificationConnection: INotificationConnection, connectionStore: ConnectionStarter): void {
        connectionStore.Connection = notificationConnection;
        if (connectionStore.Callbacks.length > 0) {
            connectionStore.Callbacks.forEach((cl: CallbackHandler) => {
                notificationConnection.listenFor<any>(cl.ListenTo).subscribe((s) => {
                    cl.Handler(cl.ListenTo, s);
                });
            });
        }
    }

    /**
     * Generating callback handler to handle execution of each server callback event
     *
     * @private
     * @template T
     * @param {string} keyType
     * @returns {CallbackHandler[]}
     * @memberof PagesComponent
     */
    private GenerateCallbackHandler<T extends BaseModel>(keyType: string): CallbackHandler[] {
        return GlobalConstants.NotificationMessage
            .filter((x) => x.Type === keyType)
            .map((z) => new CallbackHandler(z.Key, this.ExecuteOperation));
    }

    /**
     * Executes on every server callback event calling.
     * 1. This function will display toast message if available
     * 2. Raised a NotifyDataChanged for respective module to react on the event
     * @private
     * @template T
     * @param {string} key
     * @param {T} model
     * @memberof PagesComponent
     */
    private ExecuteOperation<T extends BaseModel>(key: string, model: T): void {
        const message = GlobalConstants.NotificationMessage.find((x) => x.Key === key);
        if (message.Title !== '' && message.Message !== '')
            this.toastrService.info(this.PrepareMessage<T>(message.Message, model), message.Title);
        this.globalState.NotifyDataChanged(key, model);
    }

    /**
     * Preparing the toast message content if it content placeholder of model property
     *
     * @private
     * @template T
     * @param {string} message
     * @param {T} model
     * @returns {string}
     * @memberof PagesComponent
     */
    private PrepareMessage<T extends BaseModel>(message: string, model: T): string {
        const regexp: RegExp = new RegExp(/{([^}]*)}/ig);
        if (regexp.test(message)) {
            const props: string[] = [];
            let values: any[] = [];

            message = message.replace(regexp, (match: string, contents: string, offset: number, fullStr: string) => {
                const args: string[] = contents.split(/:|\./ig);
                if (args.length > 2) {
                    props.push(args[2]);
                    return `{${args[0]}}`;
                }
                else
                    return '';
            });

            if (props.length > 0) {
                values = props.map((x) => model[x]);
                message = UtilityService.FormatString(message, values);
            }
            return message;
        }
        else return message;
    }
}