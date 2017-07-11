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

export interface IConnectionConfig {
    /** connection url to the SignalR service. */
    url?: string;

    /** Allows you to specify query string parameters object when the client connects. */
    qs?: any;

    /** name of the SignalR service hub to connect to. */
    hubName?: string;

    /** disable/enables client side logging. Defaults to false */
    logging?: boolean;

    /** Allows jsonp */
    jsonp?: boolean;

    /** Allows withCredentials */
    withCredentials?: boolean;

    /** Allows you to specify transport. You can specify a fallback order if you wan't to try specific transports in order. By default selects best avaliable transport. */
    transport?: ConnectionTransport | ConnectionTransport[];
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

export class ConnectionConfig implements IConnectionConfig {
    public url: string;
    public qs?: any;
    public hubName: string;
    public logging: boolean;
    public jsonp: boolean;
    public withCredentials: boolean;
    public transport: ConnectionTransport | ConnectionTransport[];

    /**
     * Creates an instance of ConnectionConfig.
     *
     * @memberOf ConnectionConfig
     */
    constructor() {
        this.hubName = null;
        this.logging = false;
        this.qs = null;
        this.url = null;
        this.jsonp = false;
        this.withCredentials = false;
        this.transport = ConnectionTransports.auto;
    }
}

export class ConnectionStatus {
    private static names: string[] = ['connecting', 'connected', 'reconnecting', '', 'disconnected'];
    private _value: number;

    get value(): number {
        return this._value;
    }

    get name(): string {
        return ConnectionStatus.names[Number.parseInt(this._value.toString())];
    }

    constructor(value: number) {
        if (value == null || value < 0) {
            throw new Error("Failed to create ConnectionStatus. Argument 'name' can not be null or empty.");
        }
        this._value = value;
    }

    public toString(): string {
        return this.name;
    }

    public equals(other: ConnectionStatus): boolean {
        if (other == null) {
            return false;
        }
        return this._value === other.value;
    }
}

export class ConnectionStatuses {
    private static statuses: ConnectionStatus[] =
    [
        new ConnectionStatus(0),
        new ConnectionStatus(1),
        new ConnectionStatus(2),
        new ConnectionStatus(4)
    ];

    public static get connecting(): ConnectionStatus {
        return ConnectionStatuses.statuses[0];
    }

    public static get connected(): ConnectionStatus {
        return ConnectionStatuses.statuses[1];
    }

    public static get reconnecting(): ConnectionStatus {
        return ConnectionStatuses.statuses[2];
    }

    public static get disconnected(): ConnectionStatus {
        return ConnectionStatuses.statuses[3];
    }
}

export class ConnectionTransport {
    private _name: string;

    get name(): string {
        return this._name;
    }

    constructor(name: string) {
        if (name == null || name === '') {
            throw new Error("Failed to create ConnectionTransport. Argument 'name' can not be null or empty.");
        }
        this._name = name;
    }

    public toString(): string {
        return this._name;
    }

    public equals(other: ConnectionTransport): boolean {
        if (other == null) {
            return false;
        }

        return this._name === other.name;
    }
}

export class ConnectionTransports {
    private static transports: ConnectionTransport[] =
    [
        new ConnectionTransport('foreverFrame'),
        new ConnectionTransport('longPolling'),
        new ConnectionTransport('serverSentEvents'),
        new ConnectionTransport('webSockets'),
        new ConnectionTransport('auto'),
    ];

    public static get foreverFrame(): ConnectionTransport {
        return ConnectionTransports.transports[0];
    }

    public static get longPolling(): ConnectionTransport {
        return ConnectionTransports.transports[1];
    }

    public static get serverSentEvents(): ConnectionTransport {
        return ConnectionTransports.transports[2];
    }

    public static get webSockets(): ConnectionTransport {
        return ConnectionTransports.transports[3];
    }

    public static get auto(): ConnectionTransport {
        return ConnectionTransports.transports[4];
    }
}