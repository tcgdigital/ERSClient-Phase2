import { NotificationBroadcastService, BaseModel, INotificationConnection } from '../shared';

export class ConnectionStarter {
    public HubConnection: NotificationBroadcastService;
    public Connection: INotificationConnection;
    public HubName: string;
    public QuesyString: any;
    public Callbacks: CallbackHandler[];

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
    public Handler: <T extends BaseModel>(key: string, model: T) => void;

    constructor(listenTo: string,
        handler: <T extends BaseModel>(key: string, model: T) => void) {
        this.ListenTo = listenTo;
        this.Handler = handler;
    }
}