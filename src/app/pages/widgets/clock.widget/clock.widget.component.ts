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
    counter: TimeCount;
    styleClass: string = '';
    subscriptionId: string;

    constructor(private clockWidgetService: ClockWidgetService) { }

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
        this.subscriptionId = this.clockWidgetService.subscribe('counter', (x) => {
            this.counter = <TimeCount>x;
        });
    }

    private initiateTimer(): void {
        this.clockWidgetService.initiateTimer('counter', this.initiationDateTime);
        this.counterSubscription();
    }
}