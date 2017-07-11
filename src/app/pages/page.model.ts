import { NotificationBroadcastService, BaseModel, INotificationConnection } from '../shared';

export class ConnectionStarter {
    public HubConnection: NotificationBroadcastService;
    public Connection: INotificationConnection;
    public HubName: string;
    public QuesyString: any;
    public Callbacks: CallbackListner[];

    constructor(hubConnection: NotificationBroadcastService,
        hubName: string,
        quesyString: any,
        callbacks: CallbackListner[]) {
        this.HubConnection = hubConnection;
        this.HubName = hubName;
        this.QuesyString = quesyString;
        this.Callbacks = callbacks;
    }
}

export class CallbackListner {
    public Listner: string;
    public Callback: <T extends BaseModel>(input: T) => void;

    constructor(listner: string,
        callback: <T extends BaseModel>(input: T) => void) {
        this.Listner = listner;
        this.Callback = callback;
    }
}