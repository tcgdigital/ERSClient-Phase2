import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { debug } from 'util';
import { NotificationEvents } from '../../constants/constants';

@Injectable()
export class GlobalStateService {
    private _data = new Subject<object>();
    private _dataStream$ = this._data.asObservable();
    private _subscriptions: Map<string, Function[]> = new Map<string, Function[]>();
    private _events: string[];

    constructor() {
        this._dataStream$.subscribe((data: object) => this._onEvent(data));
        this._events = new Array<string>();
        this.restrictDuplicateNotification();
    }

    NotifyDataChanged(_event: string, value: any) {
        let current = this._data[_event];
        if (current == null) {
            current = undefined;
        }
        if (current !== value) {
            this._data[_event] = value;
            this._data.next({
                event: _event,
                data: this._data[_event]
            });
        }
    }

    Subscribe(event: string, callback: Function, checkDuplicate: boolean = true) {
        let subscribers: Function[] = this._subscriptions.get(event) || new Array<Function>();

        
        checkDuplicate = !this._events.some((x: string) => x == event);

        if (checkDuplicate && subscribers.some((x: Function) => {
            console.log(event);
            return this.getCallbackName(x) == this.getCallbackName(callback);
        }))
            this._subscriptions.set(event, new Array<Function>(callback));
        else {
            subscribers.push(callback);
            this._subscriptions.set(event, subscribers);
        }

        // subscribers.push(callback);
        // this._subscriptions.set(event, subscribers);
    }

    Unsubscribe(event: string) {
        this._subscriptions.delete(event);
    }

    _onEvent(data: any) {
        const subscribers = this._subscriptions.get(data['event']) || [];

        subscribers.forEach((callback) => {
            callback.call(null, data['data']);
        });
    }

    private getCallbackName(f: Function): string {
        try {
            let func: RegExpMatchArray = f.toString().match(/function[^{]+\{([\s\S]*)\}$/)
                || f.toString().match(/^[^{]+\{(.*?)\}$/);
            
            if (func.length > 0){
                let funcBody = func[1].trim();
                console.log(funcBody);
                return funcBody;
            }
        } catch (ex) {
            console.log(ex);
        }
        return '';
    }

    private restrictDuplicateNotification(): void{
        this._events.push(NotificationEvents.DepartmentChangeFromDashboardEvent);
        this._events.push(NotificationEvents.IncidentChangeFromDashboardEvent);
        this._events.push(NotificationEvents.DepartmentChangedEvent);
        this._events.push(NotificationEvents.IncidentChangedEvent);
        this._events.push(NotificationEvents.IncidentCreatedEvent);

        this._events.push(NotificationEvents.DemandCreationResponse);
        this._events.push(NotificationEvents.DemandApprovedResponse);
        this._events.push(NotificationEvents.DemandAssignedResponse);
        this._events.push(NotificationEvents.DemandClosedResponse);
        this._events.push(NotificationEvents.CompletedDemandstoCloseResponse);
        this._events.push(NotificationEvents.DemandRejectedFromApprovalResponse);
        this._events.push(NotificationEvents.RejectedDemandsFromClosureResponse);
    }
}
