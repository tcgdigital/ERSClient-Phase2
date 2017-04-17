import { Subject } from 'rxjs/Subject';

/**
 * When SignalR runs it will add functions to the global $ variable
 * that you use to create connections to the hub. However, in this
 * class we won't want to depend on any global variables, so this
 * class provides an abstraction away from using $ directly in here.
 */
export class SignalrWindow extends Window {
    $: any;
}

export enum ConnectionState {
    Connecting = 1,
    Connected = 2,
    Reconnecting = 3,
    Disconnected = 4
}

export class ChannelConfig {
    url: string;
    hubName: string;
    qs: {};
    logging: boolean;
    channel: string;
}

export class ChannelEvent {
    Name: string;
    ChannelName: string;
    Timestamp: Date;
    Data: any;
    Json: string;

    /**
     * Creates an instance of ChannelEvent.
     *
     * @memberOf ChannelEvent
     */
    constructor() {
        this.Timestamp = new Date();
    }
}

export class ChannelSubject {
    channel: string;
    subject: Subject<ChannelEvent>;
}


export interface IConnectionConfig {
    /**
     * Connection url to the SignalR service
     *
     * @type {string}
     * @memberOf IConnectionConfig
     */
    url?: string;

    /**
     * Allows you to specify query string parameters object when the client connects
     *
     * @type {string}
     * @memberOf IConnectionConfig
     */
    qs?: string;

    /**
     * Name of the SignalR service hub to connect to
     *
     * @type {string}
     * @memberOf IConnectionConfig
     */
    hubName?: string;

    /**
     * disable/enables client side logging. Defaults to false
     *
     * @type {boolean}
     * @memberOf IConnectionConfig
     */
    logging?: boolean;

    /**
     * Allows jsonp
     * 
     * @type {boolean}
     * @memberOf IConnectionConfig
     */
    jsonp?: boolean;

    /**
     * Allows withCredentials
     *
     * @type {boolean}
     * @memberOf IConnectionConfig
     */
    withCredentials?: boolean;
}

export class ConnectionConfig implements IConnectionConfig {
    public url?: string;
    public qs?: string;
    public hubName?: string;
    public logging?: boolean;
    public jsonp?: boolean;
    public withCredentials?: boolean;

    /**
     * Creates an instance of ConnectionConfig.
     *
     * @memberOf ConnectionConfig
     */
    constructor(){
        this.logging = false;
        this.jsonp = false;
        this.withCredentials = false;
    }
}

export class ConnectionStatus {
    private _name: string;

    get name(): string {
        return this._name;
    }

    constructor(name: string) {
        if (name == null || name === '') {
            throw new Error("Failed to create ConnectionStatus. Argument 'name' can not be null or empty.");
        }
        this._name = name;
    }

    public toString(): string {
        return this._name;
    }

    public equals(other: ConnectionStatus): boolean {
        if (other === null)
            return false;
        return this._name === other.name;
    }
}

export class ConnectionStatuses {
    private static statuses: ConnectionStatus[] = [
        new ConnectionStatus('starting'),
        new ConnectionStatus('received'),
        new ConnectionStatus('connectionSlow'),
        new ConnectionStatus('reconnecting'),
        new ConnectionStatus('reconnected'),
        new ConnectionStatus('stateChanged'),
        new ConnectionStatus('disconnected')
    ];

    public static get starting(): ConnectionStatus {
        return ConnectionStatuses.statuses[0];
    }

    public static get received(): ConnectionStatus {
        return ConnectionStatuses.statuses[1];
    }

    public static get connectionSlow(): ConnectionStatus {
        return ConnectionStatuses.statuses[2];
    }

    public static get reconnecting(): ConnectionStatus {
        return ConnectionStatuses.statuses[3];
    }

    public static get reconnected(): ConnectionStatus {
        return ConnectionStatuses.statuses[4];
    }

    public static get stateChanged(): ConnectionStatus {
        return ConnectionStatuses.statuses[5];
    }

    public static get disconnected(): ConnectionStatus {
        return ConnectionStatuses.statuses[6];
    }
}