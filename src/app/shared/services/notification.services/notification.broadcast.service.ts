import { Injectable, NgZone } from '@angular/core';
import { IConnectionConfig, ConnectionConfig, ConnectionStatus } from './notification.model';
import { INotificationConnection } from './notification.connection.interface';
import { NotificationConnection } from './notification.connection';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NotificationBroadcastService {
    private _configuration: ConnectionConfig;
    private _zone: NgZone;
    private _hubConnectionFn: any;

    /**
     * Creates an instance of NotificationBroadcastService.
     * @param {ConnectionConfig} configuration
     * @param {NgZone} zone
     * @param {Function} hubConnectionFn
     *
     * @memberOf NotificationBroadcastService
     */
    constructor(configuration: ConnectionConfig, zone: NgZone, hubConnectionFn: (url: string) => any) {
        this._configuration = configuration;
        this._zone = zone;
        this._hubConnectionFn = hubConnectionFn;
    }

    public createConnection(options?: IConnectionConfig): NotificationConnection {
        // const status: Observable<ConnectionStatus>;
        const configuration = this.merge(options ? options : {});

        try {
            const serializedQs = JSON.stringify(configuration.qs);
            const serializedTransport = JSON.stringify(configuration.transport);

            if (configuration.logging) {
                console.log(`Creating connecting with...`);
                console.log(`configuration:[url: '${configuration.url}'] ...`);
                console.log(`configuration:[hubName: '${configuration.hubName}'] ...`);
                console.log(`configuration:[qs: '${serializedQs}'] ...`);
                console.log(`configuration:[transport: '${serializedTransport}'] ...`);
            }
        } catch (err) {
            console.log(err);
        }

        // create connection object
        const connection = this._hubConnectionFn(configuration.url);
        connection.logging = configuration.logging;
        connection.qs = configuration.qs;

        // create a proxy
        const proxy = connection.createHubProxy(configuration.hubName);
        // !!! important. We need to register at least one function otherwise server callbacks will not work.
        proxy.on('noOp', () => { });

        const hubConnection = new NotificationConnection(connection, proxy, this._zone, configuration);
        return hubConnection;
    }

    public connect(options?: IConnectionConfig): Promise<INotificationConnection> {
        return this.createConnection(options).start();
    }

    private merge(config: IConnectionConfig): ConnectionConfig {
        const merged: ConnectionConfig = new ConnectionConfig();
        merged.hubName = config.hubName || this._configuration.hubName;
        merged.url = config.url || this._configuration.url;
        merged.qs = config.qs || this._configuration.qs;
        merged.logging = this._configuration.logging;
        merged.jsonp = config.jsonp || this._configuration.jsonp;
        merged.withCredentials = config.withCredentials || this._configuration.withCredentials;
        merged.transport = config.transport || this._configuration.transport;
        return merged;
    }
}