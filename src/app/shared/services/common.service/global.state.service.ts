import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GlobalStateService {

    private _data = new Subject<Object>();
    private _dataStream$ = this._data.asObservable();

    private _subscriptions: Map<string, Function[]> = new Map<string, Function[]>();

    constructor() {
        this._dataStream$.subscribe((data) => this._onEvent(data));
    }

    NotifyDataChanged(_event, value) {
        let current = this._data[_event];
        if (current !== value) {
            this._data[_event] = value;

            this._data.next({
                event: _event,
                data: this._data[_event]
            });
        }
    }

    Subscribe(event: string, callback: Function) {
        let subscribers = this._subscriptions.get(event) || [];
        subscribers.push(callback);

        this._subscriptions.set(event, subscribers);
    }

    _onEvent(data: any) {
        let subscribers = this._subscriptions.get(data['event']) || [];

        subscribers.forEach((callback) => {
            callback.call(null, data['data']);
        });
    }
}
