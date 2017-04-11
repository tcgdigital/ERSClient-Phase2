import {
    Component, OnInit, Input,
    OnDestroy, OnChanges, SimpleChange,
    ViewEncapsulation
} from '@angular/core';
import { TimeCount } from './clock.widget.model';
import { ClockWidgetService } from './clock.widget.service';

@Component({
    selector: 'clock-widget',
    templateUrl: './clock.widget.view.html',
    styleUrls: ['./clock.widget.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ClockWidgetComponent implements OnInit, OnChanges, OnDestroy {
    @Input() initiationDateTime: Date;
    days: number = 0;
    hours: number = 0;
    minutes: number = 0;
    seconds: number = 0;

    styleClass: string = '';
    subscriptionId: string;

    /**
     * Creates an instance of ClockWidgetComponent.
     * @param {ClockWidgetService} clockWidgetService 
     * 
     * @memberOf ClockWidgetComponent
     */
    constructor(private clockWidgetService: ClockWidgetService) {
    }

    public ngOnInit() {
        this.initiateTimer();
    }

    public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        if (changes['initiationDateTime'].currentValue !==
            changes['initiationDateTime'].previousValue) {
            this.initiateTimer();
        }
    }

    public ngOnDestroy(): void {
        this.clockWidgetService.unsubscribe(this.subscriptionId);
    }

    private counterSubscription(): void {
        this.subscriptionId = this.clockWidgetService.subscribe('counter', (x: TimeCount) => {
            this.days = x.Days;
            this.hours = x.Hours;
            this.minutes = x.Minutes;
            this.seconds = x.Seconds;
        });
    }

    private initiateTimer(): void {
        if (this.clockWidgetService.initiateTimer('counter', this.initiationDateTime))
            this.counterSubscription();
    }
}