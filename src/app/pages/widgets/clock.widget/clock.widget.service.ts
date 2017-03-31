import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

import { TimeCount } from './clock.widget.model';
import { UtilityService } from '../../../shared';

interface TimerList {
    [name: string]: {
        name: string,
        observable: Observable<TimeCount>
    };
}

interface SubscriptionList {
    [id: string]: {
        name: string,
        subscription: Subscription
    };
}

@Injectable()
export class ClockWidgetService {
    private timer: TimerList = {};
    private subscription: SubscriptionList = {};

    constructor() { }

    initiateTimer(name: string, initialDate: Date): boolean {
        if (name === undefined || initialDate === undefined || this.timer[name]) {
            return false;
        }
        let o: Observable<TimeCount> = Observable.timer(1000)
            .map(x => {
                let diffMs: number = Math.abs((new Date().getTime()) - initialDate.getTime());

                let counter: TimeCount = new TimeCount();
                counter.Days = Math.floor(diffMs / 86400000); // days
                counter.Hours = Math.floor((diffMs % 86400000) / 3600000); // hours
                counter.Minutes = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

                return counter
            });

        this.timer[name] = { name: name, observable: o };
        return true;
    }

    subscribe(name: string, callback: (any) => void): string {
        if (!this.timer[name]) {
            return '';
        }
        let id = name + '-' + UtilityService.UUID();
        this.subscription[id] = {
            name: name,
            subscription: this.timer[name].observable.subscribe(callback)
        }
        return id;
    }

    unsubscribe(id: string): boolean {
        if (!id || !this.subscription[id]) {
            return false;
        }
        this.subscription[id].subscription.unsubscribe();
        delete this.subscription[id];
    }
}