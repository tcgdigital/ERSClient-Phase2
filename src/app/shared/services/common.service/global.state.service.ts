import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { debug } from 'util';

@Injectable()
export class GlobalStateService {
    private _data = new Subject<object>();
    private _dataStream$ = this._data.asObservable();
    private _subscriptions: Map<string, Function[]> = new Map<string, Function[]>();

    constructor() {
        this._dataStream$.subscribe((data: object) => this._onEvent(data));
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

        if (checkDuplicate && subscribers
            .some(x => this.getCallbackName(x) == this.getCallbackName(callback)))
            this._subscriptions.set(event, new Array<Function>(callback));
        else {
            subscribers.push(callback);
            this._subscriptions.set(event, subscribers);
        }
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
            return f.toString().match(/^[^{]+\{(.*?)\}$/)[1].trim();
        } catch (ex) {
            console.log(ex);
        }
        return '';
    }
}
