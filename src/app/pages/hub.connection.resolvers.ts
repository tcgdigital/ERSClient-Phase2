import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { NotificationConnection, NotificationBroadcastService } from '../shared/services/notification.services';
import { UtilityService } from '../shared/services/common.service';

@Injectable()
export class UserRegistrationHubConnectionResolver implements Resolve<NotificationConnection> {
    constructor(private _notification: NotificationBroadcastService) { }

    resolve() {
        console.log('UserRegistrationHub connection resolving...');
        const userId = +UtilityService.GetFromSession('CurrentUserId');

        return this._notification.connect({
            hubName: 'UserRegistrationNewHub',
            qs: { UserId: userId }
        });
    }
}

// @Injectable()
// export class BroadcastMessageNotificationHubConnectionResolver implements Resolve<NotificationConnection> {
//     constructor(private _notification: NotificationBroadcastService) { }

//     resolve() {
//         console.log('ConnectionResolver connection resolving...');
//         return this._notification.connect({
//             hubName: 'BroadcastMessageNotificationHub',
//             qs: {
//                 departmentId: 0,
//                 incidentId: 0
//             }
//         });
//     }
// }

// @Injectable()
// export class CasualtyStatusUpdateNotificationHubConnectionResolver implements Resolve<NotificationConnection> {
//     constructor(private _notification: NotificationBroadcastService) { }

//     resolve() {
//         console.log('CasualtyStatusUpdateNotificationHub connection resolving...');
//         return this._notification.connect({
//             hubName: 'CasualtyStatusUpdateNotificationHub',
//             qs: {
//                 departmentId: 0
//             }
//         });
//     }
// }

// @Injectable()
// export class CasualtyStatusUpdateNotificationHubConnectionResolver implements Resolve<NotificationConnection> {
//     constructor(private _notification: NotificationBroadcastService) { }

//     resolve() {
//         console.log('CasualtyStatusUpdateNotificationHub connection resolving...');
//         return this._notification.connect({
//             hubName: 'CasualtyStatusUpdateNotificationHub',
//             qs: {
//                 departmentId: 0
//             }
//         });
//     }
// }

// @Injectable()
// export class DemandHubConnectionResolver implements Resolve<NotificationConnection> {
//     constructor(private _notification: NotificationBroadcastService) { }

//     resolve() {
//         console.log('ConnectionResolver connection resolving...');
//         return this._notification.connect({ hubName: 'Demand' });
//     }
// }

