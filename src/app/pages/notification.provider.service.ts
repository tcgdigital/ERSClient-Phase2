import { Injectable } from '@angular/core';
import {
    GlobalConstants, BaseModel, GlobalStateService
} from '../shared';
import {
    NotificationConnection, BroadcastEventListener,
    NotificationBroadcastService, ConnectionConfig,
    INotificationConnection
} from '../shared/services/notification.services';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
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
import { ConnectionStarter, CallbackListner } from './page.model';


@Injectable()
export class NotificationProviderService {
    connectionStaters: ConnectionStarter[];

    constructor(
        private globalState: GlobalStateService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private broadcastMessageNotificationHub: NotificationBroadcastService,
        private casualtyStatusUpdateNotificationHub: NotificationBroadcastService,
        private checklistSubmissionNotificationHub: NotificationBroadcastService,
        private crisisClosureNotificationHub: NotificationBroadcastService,
        private crisisCreationNotificationHub: NotificationBroadcastService,
        private demandSubmissionNotificationHub: NotificationBroadcastService,
        private presidentsMessageAndMediaReleaseNotificationHub: NotificationBroadcastService,
        private presidentAndMediaWorkflowNotificationHub: NotificationBroadcastService,
        private queryNotificationHub: NotificationBroadcastService) { }

    public PrepareConnectionAndCall(incId: number, deptId: number) {
        this.CloseConnection();
        this.connectionStaters = new Array<ConnectionStarter>();

        /*this.connectionStaters.push(new ConnectionStarter(this.broadcastMessageNotificationHub,
            'BroadcastMessageNotificationHub', {
                departmentId: deptId, incidentId: incId
            }, this.CallbackListners<BroadCastModel>('BroadcastNotification')
        ));

        this.connectionStaters.push(new ConnectionStarter(this.casualtyStatusUpdateNotificationHub,
            'CasualtyStatusUpdateNotificationHub', {
                incidentId: incId
            }, this.CallbackListners<CasualtyExchangeModel>('CasualtyNotification')
        ));*/

        // this.connectionStaters.push(new ConnectionStarter(this.checklistSubmissionNotificationHub,
        //     'ChecklistSubmissionNotificationHub', {
        //         departmentId: deptId, incidentId: incId
        //     }, this.CallbackListners<ActionableModel>('ChecklistNotification')
        // ));

        /*this.connectionStaters.push(new ConnectionStarter(this.crisisClosureNotificationHub,
            'CrisisClosureNotificationHub', {
                incidentId: incId
            }, this.CallbackListners<IncidentModel>('CrisisClosureNotification')
        ));

        this.connectionStaters.push(new ConnectionStarter(this.crisisCreationNotificationHub,
            'CrisisCreationNotificationHub', null,
            this.CallbackListners<IncidentModel>('CrisisCreationNotification')
        ));*/

        this.connectionStaters.push(new ConnectionStarter(this.demandSubmissionNotificationHub,
            'DemandSubmissionNotificationHub', {
                departmentId: deptId, incidentId: incId
            }, this.CallbackListners<DemandModel>('DemandNotification')
        ));

        // this.connectionStaters.push(new ConnectionStarter(this.presidentsMessageAndMediaReleaseNotificationHub,
        //     'PresidentsMessageAndMediaReleaseNotificationHub', {
        //         incidentId: incId
        //     }, this.CallbackListners<PresidentMessageWidgetModel>('PresidentsMessageNotification')
        // ));

        // this.connectionStaters.push(new ConnectionStarter(this.presidentAndMediaWorkflowNotificationHub,
        //     'PresidentAndMediaWorkflowNotificationHub', {
        //         departmentId: deptId, incidentId: incId
        //     }, this.CallbackListners<PresidentMessageModel>('PresidentsMessageWorkflowNotification')
        // ));

        // this.connectionStaters.push(new ConnectionStarter(this.presidentsMessageAndMediaReleaseNotificationHub,
        //     'PresidentsMessageAndMediaReleaseNotificationHub', {
        //         incidentId: incId
        //     }, this.CallbackListners<MediaReleaseWidgetModel>('MediaMessageNotification')
        // ));

        // this.connectionStaters.push(new ConnectionStarter(this.presidentAndMediaWorkflowNotificationHub,
        //     'PresidentAndMediaWorkflowNotificationHub', {
        //         departmentId: deptId, incidentId: incId
        //     }, this.CallbackListners<MediaModel>('MediaMessageWorkflowNotification')
        // ));

        // this.connectionStaters.push(new ConnectionStarter(this.queryNotificationHub,
        //     'QueryNotificationHub', {
        //         incidentId: incId
        //     }, this.CallbackListners<ExternalInputModel>('EnquiryNotification')
        // ));

        this.ConnectAndListen(this.connectionStaters);
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

    private ConnectAndListen(connectionStaters: ConnectionStarter[]): void {
        connectionStaters.forEach((x) => {
            x.HubConnection.createConnection({
                hubName: x.HubName,
                qs: x.QuesyString
            }).start().then((c: INotificationConnection) => {
                x.Connection = c;
                x.Callbacks.forEach((y) => {
                    c.listenFor<any>(y.Listner).subscribe((s) => {
                        y.Callback(y.Listner, s);
                    });
                });
            });
        });
    }

    private CallbackListners<T extends BaseModel>(keyType: string): CallbackListner[] {
        return GlobalConstants.NotificationMessage
            .filter((x) => x.Type === keyType)
            .map((z) => new CallbackListner(z.Key, this.ExecuteOperation));
    }

    private ExecuteOperation<T extends BaseModel>(key: string, model: T): void {
        const message = GlobalConstants.NotificationMessage.find((x) => x.Key === key);
        if (message.Title !== '' && message.Message !== '')
            this.toastrService.info(message.Message, message.Title);
        this.globalState.NotifyDataChanged(key, model);
    }

    // const showMessage: <T extends BaseModel>(key: string, model: T) => void =
    //         <T extends BaseModel>(key: string, model: T) => {
    //             const message = GlobalConstants.NotificationMessage.find((x) => x.Key === key);
    //             if (message.Title !== '' && message.Message !== '')
    //                 this.toastrService.info(message.Message, message.Title);
    //             this.globalState.NotifyDataChanged(key, model);
    //         };

    // const callbackListners: <T extends BaseModel>(keys: string[]) => CallbackListner[] =
    //         <T extends BaseModel>(keys: string[]) => {
    //             return GlobalConstants.NotificationMessage
    //                 .filter((x) => keys.some((y) => y === x.Key))
    //                 .map((z) => new CallbackListner(z.Key, (data) => { showMessage(z.Key, data); }));
    //         };

}