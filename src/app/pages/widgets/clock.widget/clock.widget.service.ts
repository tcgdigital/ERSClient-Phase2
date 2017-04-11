import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import * as moment from 'moment';

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

    private days: number = 24 * 60 * 60;
    private hours: number = 60 * 60;
    private minutes: number = 60;
    private timePassed: number = 0;
    private counter: TimeCount = new TimeCount();

    constructor() { }

    initiateTimer(name: string, initialDate: Date): boolean {
        if (name === undefined || initialDate === undefined || this.timer[name]) {
            return false;
        }
        // let past = moment(initialDate);
        let o: Observable<TimeCount> = Observable.interval(1000)
            .map(x => {
                this.timePassed = Math.floor((new Date().getTime() - initialDate.getTime()) / 1000);
                
                this.counter.Days = Math.floor(this.timePassed / this.days);
                this.timePassed -= this.counter.Days * this.days;

                this.counter.Hours = Math.floor(this.timePassed / this.hours);
                this.timePassed -= this.counter.Hours * this.hours;

                this.counter.Minutes = Math.floor(this.timePassed / this.minutes);
                this.timePassed -= this.counter.Minutes * this.minutes;

                this.counter.Seconds = this.timePassed;
                return this.counter
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