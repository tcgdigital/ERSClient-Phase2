import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { UtilityService } from '../common.service';

@Injectable()
export class DataExchangeService<T> {
    messageQueue: {} = {};
    subscription: {} = {};

    public GetQueue(): string[] {
        return Object.keys(this.messageQueue);
    }

    public GetSubscription(): string[] {
        return Object.keys(this.subscription);
    }

    public NewQueue(name: string): void {
        if (name === undefined || this.IsKeyExists(name)) {
            return;
        }
        let _subject: Subject<T> = new Subject<T>();
        let _observable: Observable<T> = _subject.asObservable();
        this.messageQueue[name] = { subject: _subject, observable: _observable };
    }

    public DelQueue(name: string) {
        let _this = this;
        if (name === undefined || !this.IsKeyExists(name)) {
            return false;
        }
        let _subscription: string[] = this.GetSubscription();
        if (_subscription.length > 0) {
            _subscription.forEach((value: string, index: number) => {
                if (_this.subscription[value].name === name) {
                    _this.Unsubscribe(value);
                }
            });
        }
    }

    public Publish(name: string, data: T, lazy: boolean = true) {
        if (data === undefined || name === undefined) {
            return;
        }
        if (lazy) {
            this.NewQueue(name);
        }
        else if (!this.IsKeyExists(name)) {
            return;
        }
        this.messageQueue[name].subject.next(data);
    }

    public PublishSingle(name: string, data: T, lazy: boolean = true) {
        if (data === undefined || name === undefined) {
            return;
        }
        if (lazy) {
            this.NewQueue(name);
        }
        else if (!this.IsKeyExists(name)) {
            return;
        }
        this.messageQueue[name].subject.next(data);
        this.messageQueue[name].subject.complete();
    }

    public Subscribe(name: string, callback: (type: T) => void, lazy: boolean = true): string {
        //if (lazy === void 0) { lazy = true; }
        if (name === undefined || callback === undefined) {
            return '';
        }
        if (lazy) {
            this.NewQueue(name);
        }
        else if (!this.IsKeyExists(name)) {
            return '';
        }
        let id = name + '-' + UtilityService.UUID();
        this.subscription[id] = {
            name: name,
            subscription: this.messageQueue[name].observable.subscribe(callback)
        };
        return id;
    }

    public Unsubscribe(id: string) {
        if (id === undefined || !this.subscription[id]) {
            return false;
        }
        this.subscription[id].subscription.unsubscribe();
        delete this.subscription[id];
    }

    private IsKeyExists(name: string) {
        return Object.keys(this.messageQueue).some(key => key === name)
    }
}