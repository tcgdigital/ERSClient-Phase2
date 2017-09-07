import {
    Component, OnInit, Input,
    OnDestroy, OnChanges, SimpleChange,
    ViewEncapsulation
} from '@angular/core';
import {
    GlobalConstants
} from '../../../shared';
import * as moment from 'moment/moment';
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
    @Input() currentIncidentId: number;
    @Input('initiatedDepartmentId') initiatedDepartmentId: number;
    @Input('isArchive') isArchive: boolean;
    @Input('closedDate') closedDate: Date;


    days: number = 0;
    hours: number = 0;
    minutes: number = 0;
    seconds: number = 0;

    styleClass: string = '';
    subscriptionId: string;
    public isShow: boolean = true;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;
    /**
     * Creates an instance of ClockWidgetComponent.
     * @param {ClockWidgetService} clockWidgetService
     *
     * @memberOf ClockWidgetComponent
     */
    constructor(private clockWidgetService: ClockWidgetService) {
    }

    public ngOnInit() {
        // this.initiateTimer();
    }

    public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        if (changes['initiationDateTime'] !== undefined &&
            (changes['initiationDateTime'].currentValue !==
                changes['initiationDateTime'].previousValue) &&
            changes['initiationDateTime'].previousValue !== undefined) {
            this.initiateTimer();
        }
    }

    public ngOnDestroy(): void {
        this.clockWidgetService.unsubscribe(this.subscriptionId);
    }

    private counterSubscription(): void {
        this.subscriptionId = this.clockWidgetService
            .subscribe(`Counter`, this.currentIncidentId.toString(), (x: TimeCount) => {
                this.days = x.Days;
                this.hours = x.Hours;
                this.minutes = x.Minutes;
                this.seconds = x.Seconds;
            });
    }

    private initiateTimer(): void {
        let utcInitiation: Date = new Date(this.initiationDateTime.toISOString().replace('Z', ''));

        if (this.isArchive) {
            let utcClosed: Date = new Date(this.closedDate.toString().substr(0,23));

            if (this.clockWidgetService.initiateTimerStatic(`Counter`, utcInitiation, this.closedDate))
                this.counterSubscription();
        }
        else {
            if (this.clockWidgetService.initiateTimer(`Counter`, utcInitiation))
                this.counterSubscription();
        }
    }
}