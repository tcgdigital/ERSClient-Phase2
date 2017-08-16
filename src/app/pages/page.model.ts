import { NotificationBroadcastService, BaseModel, INotificationConnection } from '../shared';

export class ConnectionStarter {
    public HubConnection: NotificationBroadcastService;
    public Connection: INotificationConnection;
    public HubName: string;
    public QuesyString: any;
    public Callbacks: CallbackHandler[];

    /**
     * Creates an instance of ConnectionStarter.
     * @param {NotificationBroadcastService} hubConnection 
     * @param {string} hubName 
     * @param {*} quesyString 
     * @param {CallbackHandler[]} callbacks 
     * @memberof ConnectionStarter
     */
    constructor(hubConnection: NotificationBroadcastService,
        hubName: string,
        quesyString: any,
        callbacks: CallbackHandler[]) {
        this.HubConnection = hubConnection;
        this.HubName = hubName;
        this.QuesyString = quesyString;
        this.Callbacks = callbacks;
    }
}

export class CallbackHandler {
    public ListenTo: string;
    public Handler: <T extends BaseModel|any>(key: string, model: T) => void;

    /**
     * Creates an instance of CallbackHandler.
     * @param {string} listenTo 
     * @param {(<T extends BaseModel|any>(key: string, model: T) => void)} handler 
     * @memberof CallbackHandler
     */
    constructor(listenTo: string,
        handler: <T extends BaseModel|any>(key: string, model: T) => void) {
        this.ListenTo = listenTo;
        this.Handler = handler;
    }
}