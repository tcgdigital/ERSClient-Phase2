import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import * as _ from 'underscore';
import { Observable } from 'rxjs/Observable';
import { ConnectionStarter, CallbackHandler } from './page.model';
import {
    SideMenuService, KeyValue,
    ResponseModel, GlobalStateService,
    StorageType, GlobalConstants, BaseModel, KeyValueService, KeyValueModel
} from '../shared';
import { IncidentService, IncidentModel } from './incident';
import { PAGES_MENU } from './pages.menu';
import { UtilityService } from '../shared/services';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthenticationService } from './login/components/authentication.service';
import { UserPermissionService } from './masterdata/userpermission/components';
import { UserPermissionModel } from './masterdata/userpermission/components';
import {
    NotificationBroadcastService, INotificationConnection
} from '../shared/services/notification.services';
import { BroadCastModel } from './shared.components/broadcast';
import { CasualtyExchangeModel } from './widgets/casualty.summary.widget';
import { ActionableModel } from './shared.components/actionables';
import { DemandModel } from './shared.components/demand';
import { MediaModel } from './shared.components/media';
import { ExternalInputModel } from './callcenteronlypage';
import { PresidentMessageModel } from './shared.components/presidentMessage';
import { PresidentMessageWidgetModel } from './widgets/presidentMessage.widget';
import { MediaReleaseWidgetModel } from './widgets/mediaRelease.widget';
import { WorldTimeWidgetComponent } from './widgets/world.time.widget';
import { RAGScaleService, RAGScaleModel } from './shared.components/ragscale';
import { Subject } from 'rxjs';

@Component({
    selector: 'pages',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './pages.view.html',
    providers: [RAGScaleService]
})
export class PagesComponent implements OnInit {
    @ViewChild('changePasswordModel') public changePasswordModel: ModalDirective;
    @ViewChild('quickLinkModel') public quickLinkModel: ModalDirective;
    @ViewChild('worldClockComponent') public worldClockComponent: WorldTimeWidgetComponent;

    public sideMenuState: boolean = false;
    public departments: KeyValue[] = [];
    public incidents: KeyValue[] = [];
    public incidentOrganizations: KeyValue[] = [];
    public currentDepartmentId: number = 0;
    public currentIncidentId: number = 0;
    public userName: string;
    public lastLogin: Date;
    public userId: number;
    public isLanding: boolean = false;
    public showQuicklink: boolean = false;
    public connectionStaters: ConnectionStarter[];
    public activeKeyValues: KeyValueModel[] = [];
    public ExecuteOperationProxy: (...args: any[]) => void;
    public ExecuteOperationProxySimple: (...args: any[]) => void;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     *Creates an instance of PagesComponent.
     * @param {Router} router
     * @param {SideMenuService} sideMenuService
     * @param {IncidentService} incidentService
     * @param {UserPermissionService} userPermissionService
     * @param {AuthenticationService} authenticationService
     * @param {GlobalStateService} globalState
     * @param {ToastrService} toastrService
     * @param {ToastrConfig} toastrConfig
     * @param {NotificationBroadcastService} passengerImportCompletedNotificationHub
     * @param {NotificationBroadcastService} cargoImportCompletedNotificationHub
     * @param {NotificationBroadcastService} crewImportCompletedNotificationHub
     * @param {NotificationBroadcastService} incidentBorrowingNotificationHub
     * @param {NotificationBroadcastService} broadcastMessageNotificationHub
     * @param {NotificationBroadcastService} casualtyStatusUpdateNotificationHub
     * @param {NotificationBroadcastService} checklistSubmissionNotificationHub
     * @param {NotificationBroadcastService} crisisClosureNotificationHub
     * @param {NotificationBroadcastService} crisisCreationNotificationHub
     * @param {NotificationBroadcastService} demandSubmissionNotificationHub
     * @param {NotificationBroadcastService} mediaReleaseNotificationHub
     * @param {NotificationBroadcastService} mediaReleaseWorkflowNotificationHub
     * @param {NotificationBroadcastService} presidentsMessageNotificationHub
     * @param {NotificationBroadcastService} presidentMessageWorkflowNotificationHub
     * @param {NotificationBroadcastService} queryNotificationHub
     * @param {KeyValueService} keyValueService
     * @memberof PagesComponent
     */
    constructor(private router: Router,
        private sideMenuService: SideMenuService,
        private incidentService: IncidentService,
        private userPermissionService: UserPermissionService,
        private authenticationService: AuthenticationService,
        private globalState: GlobalStateService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private passengerImportCompletedNotificationHub: NotificationBroadcastService,
        private cargoImportCompletedNotificationHub: NotificationBroadcastService,
        private crewImportCompletedNotificationHub: NotificationBroadcastService,
        private incidentBorrowingNotificationHub: NotificationBroadcastService,
        private broadcastMessageNotificationHub: NotificationBroadcastService,
        private casualtyStatusUpdateNotificationHub: NotificationBroadcastService,
        private checklistSubmissionNotificationHub: NotificationBroadcastService,
        private crisisClosureNotificationHub: NotificationBroadcastService,
        private crisisCreationNotificationHub: NotificationBroadcastService,
        private demandSubmissionNotificationHub: NotificationBroadcastService,
        private mediaReleaseNotificationHub: NotificationBroadcastService,
        private mediaReleaseWorkflowNotificationHub: NotificationBroadcastService,
        private presidentsMessageNotificationHub: NotificationBroadcastService,
        private presidentMessageWorkflowNotificationHub: NotificationBroadcastService,
        private queryNotificationHub: NotificationBroadcastService,
        private keyValueService: KeyValueService,
        private ragScaleService: RAGScaleService, ) {

        this.ConfigureToster();

        this.ExecuteOperationProxy = (...args: any[]) => {
            this.ExecuteOperation.apply(this, args);
        };
        this.ExecuteOperationProxySimple = (...args: any[]) => {
            this.ExecuteOperationSimple.apply(this, args);
        };
    }

    public ngOnInit(): void {
        this.getAllActiveKeyValues();
        this.sideMenuService.updateMenuByRoutes(PAGES_MENU as Routes);
        this.userName = UtilityService.GetFromSession('CurrentLoggedInUserName', StorageType.LocalStorage);
        this.userId = +UtilityService.GetFromSession('CurrentUserId');
        this.lastLogin = new Date(UtilityService.GetFromSession('LastLoginTime', StorageType.LocalStorage));

        const local_incidents: Observable<IncidentModel[]> = this.GetIncidents();
        const local_departments: Observable<UserPermissionModel[]> = this.GetUserDepartments();

        this.ProcessData(() => {
            this.PrepareConnectionAndCall(this.currentIncidentId, this.currentDepartmentId);

            this.globalState.Subscribe('incidentCreate', (model: number) => {
                this.getIncidents(() => {
                    this.PrepareConnectionAndCall(this.currentIncidentId, this.currentDepartmentId);
                });
                this.worldClockComponent.SetCrisisLocationClock(model);
                this.globalState.Unsubscribe('incidentCreate');
            });

            // SignalR Notification
            this.globalState.Subscribe
                (GlobalConstants.NotificationConstant.ReceiveCrisisClosureResponse.Key, (model) => {
                    Observable.timer(5000).subscribe((x) => {
                        this.authenticationService.Logout();
                        this.router.navigate(['login']);
                    });
                });
        }, local_incidents, local_departments);

        this.getRAGScaleData();
    }

    public getAllActiveKeyValues(): void {
        this.keyValueService.GetAll()
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<KeyValueModel>) => {
                this.activeKeyValues = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    public ngOnDestroy(): void {
        //  this.globalState.Unsubscribe('incidentCreate');
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public toggleSideMenu($event): void {
        this.sideMenuState = !this.sideMenuState;
    }

    public onContactClicked($event): void {
        this.globalState.NotifyDataChanged(GlobalConstants.DataExchangeConstant.ContactClicked, (new Date().getTime()));
    }

    public onHelpClicked($event): void {
        this.toastrService.info('Help command has been clicked', 'Help', this.toastrConfig);
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

        this.globalState.NotifyDataChanged(GlobalConstants.DataExchangeConstant.DepartmentChange, selectedDepartment);
        this.PrepareConnectionAndCall(this.currentIncidentId, this.currentDepartmentId);
        if (+this.activeKeyValues.find((x: KeyValueModel) => x.Key === 'CallCenterDepartmentId').Value == this.currentDepartmentId) {
            this.router.navigate(['pages/callcenteronlypage']);
        }
    }

    public onIncidentChange(selectedIncident: KeyValue): void {
        UtilityService.SetToSession({ CurrentIncidentId: selectedIncident.Value });
        this.currentIncidentId = selectedIncident.Value;
        UtilityService.SetToSession({
            CurrentOrganizationId: this.incidentOrganizations
                .find((z) => z.Key === selectedIncident.Value.toString()).Value
        });
        this.globalState.NotifyDataChanged(GlobalConstants.DataExchangeConstant.IncidentChange, selectedIncident);
        this.PrepareConnectionAndCall(this.currentIncidentId, this.currentDepartmentId);
    }

    public onMenuClick($event): void {
        this.showQuicklink = true;
        if ($event === 'quicklink') {
            this.quickLinkModel.show();
        }
    }

    private getDepartments(callback: () => void = null): void {
        this.GetUserDepartments()
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((userDepartments: UserPermissionModel[]) => {
                this.ProcessUserDepartments(userDepartments);
                if (callback != null)
                    callback();
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    private getIncidents(callback: () => void = null): void {
        this.GetIncidents()
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((incidents: IncidentModel[]) => {
                this.ProcessIncidents(incidents);
                if (callback != null)
                    callback();
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
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
                if (a.Department.DepartmentName.trim().toLowerCase() < b.Department.DepartmentName.trim().toLowerCase()) return -1;
                if (a.Department.DepartmentName.trim().toLowerCase() > b.Department.DepartmentName.trim().toLowerCase()) return 1;
                return 0;
            }));
    }

    private ProcessData(callback: () => void, ...observables: Array<Observable<any[]>>): void {
        Observable.forkJoin(observables)
            .subscribe((res: any[]) => {
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
                if (+this.activeKeyValues.find((x: KeyValueModel) => x.Key === 'CallCenterDepartmentId').Value == this.currentDepartmentId) {
                    this.router.navigate(['pages/callcenteronlypage']);
                }
            }
        }
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

            if (window.location.href.indexOf('localhost') == -1) {
                // if (window.location.href.indexOf('localhost') > -1) {
                this.connectionStaters.push(new ConnectionStarter(this.passengerImportCompletedNotificationHub,
                    'PassengerImportCompletedNotificationHub', {
                        incidentId: incId
                    }, this.GenerateCallbackSimpleHandler('PassengerImportNotification')
                ));

                this.connectionStaters.push(new ConnectionStarter(this.cargoImportCompletedNotificationHub,
                    'CargoImportCompletedNotificationHub', {
                        incidentId: incId
                    }, this.GenerateCallbackSimpleHandler('CargoImportNotification')
                ));

                this.connectionStaters.push(new ConnectionStarter(this.crewImportCompletedNotificationHub,
                    'CrewImportCompletedNotificationHub', {
                        incidentId: incId
                    }, this.GenerateCallbackSimpleHandler('CrewImportNotification')
                ));

                this.connectionStaters.push(new ConnectionStarter(this.incidentBorrowingNotificationHub,
                    'IncidentBorrowingNotificationHub', {
                        incidentId: incId
                    }, this.GenerateCallbackSimpleHandler('IncidentBorrowNotification')
                ));

                this.connectionStaters.push(new ConnectionStarter(this.broadcastMessageNotificationHub,
                    'BroadcastMessageNotificationHub', {
                        departmentId: deptId, incidentId: incId
                    }, this.GenerateCallbackHandler<BroadCastModel>('BroadcastNotification')
                ));

                this.connectionStaters.push(new ConnectionStarter(this.casualtyStatusUpdateNotificationHub,
                    'CasualtyStatusUpdateNotificationHub', {
                        incidentId: incId
                    }, this.GenerateCallbackHandler<CasualtyExchangeModel>('CasualtyNotification')
                ));

                this.connectionStaters.push(new ConnectionStarter(this.checklistSubmissionNotificationHub,
                    'ChecklistSubmissionNotificationHub', {
                        departmentId: deptId, incidentId: incId
                    }, this.GenerateCallbackHandler<ActionableModel>('ChecklistNotification')
                ));

                this.connectionStaters.push(new ConnectionStarter(this.crisisClosureNotificationHub,
                    'CrisisClosureNotificationHub', {
                        incidentId: incId
                    }, this.GenerateCallbackHandler<IncidentModel>('CrisisClosureNotification')
                ));

                this.connectionStaters.push(new ConnectionStarter(this.crisisCreationNotificationHub,
                    'CrisisCreationNotificationHub', null,
                    this.GenerateCallbackHandler<IncidentModel>('CrisisCreationNotification')
                ));

                this.connectionStaters.push(new ConnectionStarter(this.demandSubmissionNotificationHub,
                    'DemandSubmissionNotificationHub', {
                        departmentId: deptId, incidentId: incId
                    }, this.GenerateCallbackHandler<DemandModel>('DemandNotification')
                ));

                this.connectionStaters.push(new ConnectionStarter(this.presidentsMessageNotificationHub,
                    'PresidentsMessageNotificationHub', {
                        incidentId: incId
                    }, this.GenerateCallbackHandler<PresidentMessageWidgetModel>('PresidentsMessageNotification')
                ));

                this.connectionStaters.push(new ConnectionStarter(this.presidentMessageWorkflowNotificationHub,
                    'PresidentMessageWorkflowNotificationHub', {
                        departmentId: deptId, incidentId: incId
                    }, this.GenerateCallbackHandler<PresidentMessageModel>('PresidentsMessageWorkflowNotification')
                ));

                this.connectionStaters.push(new ConnectionStarter(this.mediaReleaseNotificationHub,
                    'MediaReleaseNotificationHub', {
                        incidentId: incId
                    }, this.GenerateCallbackHandler<MediaReleaseWidgetModel>('MediaMessageNotification')
                ));

                this.connectionStaters.push(new ConnectionStarter(this.mediaReleaseWorkflowNotificationHub,
                    'MediaReleaseWorkflowNotificationHub', {
                        departmentId: deptId, incidentId: incId
                    }, this.GenerateCallbackHandler<MediaModel>('MediaMessageWorkflowNotification')
                ));

                this.connectionStaters.push(new ConnectionStarter(this.queryNotificationHub,
                    'QueryNotificationHub', {
                        incidentId: incId
                    }, this.GenerateCallbackHandler<ExternalInputModel>('EnquiryNotification')
                ));

                this.ConnectAndListen(this.connectionStaters);
            }
        }
        else {
            this.connectionStaters.forEach((store: ConnectionStarter) => {
                if (store.Connection) {
                    if (store.QuesyString !== null)
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

    /**
     * Connect notification hub and call listner to listen server event
     * This function will call first time to for registered hub connections
     * @private
     * @param {ConnectionStarter[]} connectionStaters
     * @memberof PagesComponent
     */
    private ConnectAndListen(connectionStaters: ConnectionStarter[]): void {
        Observable.interval(GlobalConstants.SIGNAL_CONNECTION_DELAY)
            .take(connectionStaters.length) // end the observable after it pulses N times
            .map((i: number) => connectionStaters[i])
            .subscribe((x: ConnectionStarter) => {
                console.log(`Connecting: ${x.HubName}`);
                x.HubConnection.createConnection({
                    hubName: x.HubName,
                    qs: x.QuesyString
                }).start().then((c: INotificationConnection) => {
                    this.ListenCallbacks(c, x);
                });
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
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
     * (Generic function)
     * @private
     * @template T
     * @param {string} keyType
     * @returns {CallbackHandler[]}
     * @memberof PagesComponent
     */
    private GenerateCallbackHandler<T extends BaseModel>(keyType: string): CallbackHandler[] {
        return GlobalConstants.NotificationMessage
            .filter((x) => x.Type === keyType)
            .map((z) => new CallbackHandler(z.Key, this.ExecuteOperationProxy));
    }

    /**
     * Generating callback handler to handle execution of each server callback event
     * (Non-Generic function)
     * @private
     * @param {string} keyType 
     * @returns {CallbackHandler[]} 
     * @memberof PagesComponent
     */
    private GenerateCallbackSimpleHandler(keyType: string): CallbackHandler[] {
        return GlobalConstants.NotificationMessage
            .filter((x) => x.Type === keyType)
            .map((z) => new CallbackHandler(z.Key, this.ExecuteOperationProxySimple));
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
        if (message.Title !== '' && message.Message !== ''
            /*&& model.CreatedBy !== +UtilityService.GetFromSession('CurrentUserId')*/) {
            const msg: string = this.PrepareMessage<T>(message.Message, model);
            const activeToaste = this.toastrService.info(msg, message.Title);
            activeToaste.onShown.subscribe(() => this.PlaySound());
        }
        this.globalState.NotifyDataChanged(key, model);
    }

    /**
     * Executes on every server callback event calling.
     * 1. This function will display toast message if available
     * 2. Raised a NotifyDataChanged for respective module to react on the event
     * (Non-Generic Function)
     * @private
     * @param {string} key 
     * @param {*} model 
     * @memberof PagesComponent
     */
    private ExecuteOperationSimple(key: string, model: any): void {
        const message = GlobalConstants.NotificationMessage.find((x) => x.Key === key);
        if (message.Title !== '' && message.Message !== '') {
            if (key == GlobalConstants.NotificationConstant.ReceivePassengerImportCompletionResponse.Key && model.toString() == '0')
                console.log('Default message omitted');
            else if (key == GlobalConstants.NotificationConstant.ReceiveCargoImportCompletionResponse.Key && model.toString() == '0')
                console.log('Default message omitted');
            else if (key == GlobalConstants.NotificationConstant.ReceiveCrewImportCompletionResponse.Key && model.toString() == '0')
                console.log('Default message omitted');
            else {
                const activeToaste = this.toastrService.info(message.Message, message.Title);
                activeToaste.onShown.subscribe(() => this.PlaySound());
            }
        }
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

    private ConfigureToster(): void {
        this.toastrConfig.closeButton = true;
        this.toastrConfig.progressBar = true;
        this.toastrConfig.enableHtml = true;
        this.toastrConfig.preventDuplicates = true;
        this.toastrConfig.timeOut = 10000;
        this.toastrConfig.extendedTimeOut = 5000;
    }

    private PlaySound(): void {
        const audio = new Audio();
        audio.src = '../assets/sounds/alarm.wav';
        audio.loop = false;
        audio.autoplay = false;
        audio.load();
        audio.play();
    }

    /**
     *In case of page reload get RAGScaleData from database
     *
     * @private
     * @memberof PagesComponent
     */
    private getRAGScaleData() {
        if (UtilityService.RAGScaleData.length == 0) {
            this.ragScaleService.GetAllActive()
                .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
                .takeUntil(this.ngUnsubscribe)
                .subscribe((item: ResponseModel<RAGScaleModel>) => {
                    UtilityService.RAGScaleData = item.Records;
                }, (error: any) => {
                    console.log(`Error: ${error.message}`);
                });
        }
    }
}