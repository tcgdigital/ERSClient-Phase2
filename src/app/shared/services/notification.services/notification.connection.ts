import { Observable, Subject } from 'rxjs/Rx';
import { NgZone } from '@angular/core';
import { ConnectionStatus, ConnectionConfig, ConnectionTransport } from './notification.model';
import { INotificationConnection } from './notification.connection.interface';
import { BroadcastEventListener } from './broadcast.event.listener';

export class NotificationConnection implements INotificationConnection {
    private _status: Observable<ConnectionStatus>;
    private _errors: Observable<any>;
    private _connection: any;
    private _proxy: any;
    private _zone: NgZone;
    private _config: ConnectionConfig;

    /**
     * Creates an instance of NotificationConnection.
     * @param {*} jConnection
     * @param {*} proxy
     * @param {NgZone} zone
     *
     * @memberOf NotificationConnection
     */
    constructor(jConnection: any, proxy: any, zone: NgZone, config: ConnectionConfig) {
        this._proxy = proxy;
        this._connection = jConnection;
        this._zone = zone;
        this._errors = this.wireUpErrorsAsObservable();
        this._status = this.wireUpStatusEventsAsObservable();
        this._config = config;
    }

    public get errors(): Observable<any> {
        return this._errors;
    }

    public get status(): Observable<ConnectionStatus> {
        return this._status;
    }

    public get id(): string {
        return this._connection.id;
    }

    public get connection(): any {
        return this._connection;
    }

    public get hubProxy(): any {
        return this._proxy;
    }

    public start(): Promise<INotificationConnection> {
        const transports = this.convertTransports(this._config.transport);

        const $promise = new Promise<INotificationConnection>((resolve, reject) => {
            this._connection
                .start({
                    jsonp: this._config.jsonp,
                    transport: transports,
                    withCredentials: this._config.withCredentials,
                })
                .done(() => {
                    console.log(`Connection established, ID: ${this._connection.id}`);
                    console.log(`Connection established, Transport: ${this._connection.transport.name}`);
                    resolve(this);
                })
                .fail((error: any) => {
                    console.log('Could not connect');
                    reject(`Failed to connect. Error: ${error.message}`); // ex: Error during negotiation request.
                });
        });
        return $promise;
    }

    public reconnect(connectionStore: any,
        callbackFunc: (connection: any, store: any) => void): void {
        try {
            this.stop();
            this._connection.qs = connectionStore.QuesyString;
            this._connection.start();
            /* this.start().then((connection: INotificationConnection) => {
                callbackFunc(connection, connectionStore);
            });*/
        } catch (ex) {
            console.log(ex);
        }
    }

    public invoke(method: string, ...parameters: any[]): Promise<any> {
        if (method == null)
            throw new Error('SignalRConnection: Failed to invoke. Argument \'method\' can not be null');

        this.log(`SignalRConnection. Start invoking \'${method}\'...`);

        const $promise: Promise<any> = new Promise<any>((resolve, reject) => {
            this._proxy.invoke(method, ...parameters)
                .done((result: any) => {
                    this.log(`\'${method}\' invoked succesfully. Resolving promise...`);
                    resolve(result);
                    this.log(`Promise resolved.`);
                })
                .fail((err: any) => {
                    console.log(`Invoking \'${method}\' failed. Rejecting promise...`);
                    reject(err);
                    console.log(`Promise rejected.`);
                });
        });

        return $promise;
    }

    public listen<T>(listener: BroadcastEventListener<T>): void {
        if (listener == null)
            throw new Error('Failed to listen. Argument \'listener\' can not be null');

        this.log(`SignalRConnection: Starting to listen to server event with name ${listener.event}`);
        this._proxy.on(listener.event, (...args: any[]) => {
            this._zone.run(() => {
                let casted: T = null;
                if (args.length === 0) {
                    return;
                }
                casted = args[0] as T;
                this.log('SignalRConnection.proxy.on invoked. Calling listener next() ...');

                listener.next(casted);
                this.log('listener next() called.');
            });
        });
    }

    public listenFor<T>(event: string): BroadcastEventListener<T> {
        if (event == null || event === '')
            throw new Error('Failed to listen. Argument \'event\' can not be empty');

        const listener = new BroadcastEventListener<T>(event);
        this.listen(listener);
        return listener;
    }

    public stop(): void {
        this._connection.stop();
    }

    private wireUpErrorsAsObservable(): Observable<any> {
        const sError: Subject<any> = new Subject<any>();

        this._connection.error((error: any) => {
            // this._zone.run(() => {
            sError.next(error);
            // });
        });
        return sError;
    }

    private wireUpStatusEventsAsObservable(): Observable<ConnectionStatus> {
        const sStatus: Subject<any> = new Subject<ConnectionStatus>();

        // aggregate all signalr connection status handlers into 1 observable.
        // handler wire up, for signalr connection status callback.
        this._connection.stateChanged((change: any) => {
            this._zone.run(() => {
                sStatus.next(new ConnectionStatus(change.newState));
            });
        });

        return sStatus;
    }

    private convertTransports(transports: ConnectionTransport | ConnectionTransport[]): any {
        if (transports instanceof Array) {
            return transports.map((t: ConnectionTransport) => t.name);
        }
        return transports.name;
    }

    private onBroadcastEventReceived<T>(listener: BroadcastEventListener<T>, ...args: any[]) {
        this.log('SignalRConnection.proxy.on invoked. Calling listener next() ...');

        let casted: T = null;
        if (args.length > 0) {
            casted = args[0] as T;
        }

        this._zone.run(() => {
            listener.next(casted);
        });

        this.log('listener next() called.');
    }

    private log(...args: any[]) {
        if (this._connection.logging === false) {
            return;
        }
        console.log(args.join(', '));
    }
}