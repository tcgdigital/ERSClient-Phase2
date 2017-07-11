import { NgModule, OpaqueToken, NgZone, ModuleWithProviders } from '@angular/core';
import { ConnectionConfig, NotificationBroadcastService } from './index';

const SIGNALR_CONFIGURATION = new OpaqueToken('SIGNALR_CONFIGURATION');

export function createSignalr(configuration: ConnectionConfig, zone: NgZone) {
    const connectionFn = getConnectionFn();
    return new NotificationBroadcastService(configuration, zone, connectionFn);
}

function getConnectionFn(): any {
    const jQuery = getJquery();
    const hubConnectionFn = (window as any).jQuery.hubConnection;
    if (hubConnectionFn == null) {
        throw new Error('Signalr failed to initialize. Script \'jquery.signalR.js\' is missing. Please make sure to include \'jquery.signalR.js\' script.');
    }
    return hubConnectionFn;
}

function getJquery(): any {
    const jQuery = (window as any).jQuery;
    if (jQuery == null) {
        throw new Error('Signalr failed to initialize. Script \'jquery.js\' is missing. Please make sure to include jquery script.');
    }
    return jQuery;
}

@NgModule({
    providers: [{
        provide: NotificationBroadcastService,
        useValue: NotificationBroadcastService
    }]
})
export class NotificationModule {
    public static forRoot(getSignalRConfiguration: () => void): ModuleWithProviders {
        return {
            ngModule: NotificationModule,
            providers: [
                {
                    provide: SIGNALR_CONFIGURATION,
                    useFactory: getSignalRConfiguration
                },
                {
                    deps: [SIGNALR_CONFIGURATION, NgZone],
                    provide: NotificationBroadcastService,
                    useFactory: (createSignalr)
                }
            ],
        };
    }
    public static forChild(): ModuleWithProviders {
        throw new Error('forChild method not implemented');
    }
}
