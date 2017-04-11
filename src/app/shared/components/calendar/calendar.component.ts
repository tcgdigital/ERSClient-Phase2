import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { CalendarService } from './calendar.service';
import { CalendarOptions, CalendarLanguage, LANGUAGES } from './calendar.model';

@Component({
    selector: 'calender',
    templateUrl: 'calendar.view.html',
    styleUrls: ['./calendar.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {
    @Input() options: CalendarOptions;
    @Input() initialDate: Date;

    @Output() dateChange = new EventEmitter<Date>();

    calendarLanguage: CalendarLanguage;
    calendarService: CalendarService;

    constructor() { }

    public initialize(options: CalendarOptions, initialDate: Date, dateChanging: Function): void {
        this.options = options;
        this.initialDate = initialDate;
        
    }

    public ngOnInit(): void {
        if (!this.options) {
            this.options = new CalendarOptions();
        }
        this.calendarLanguage = LANGUAGES.get(this.options.language);
        this.calendarService = new CalendarService(this.initialDate);
    }

    setDate(index?: number) {
        if (this.calendarService.days[index]) {
            this.calendarService.selectDate(index);
        }

        this.initialDate.setTime(Date.parse(`${this.calendarService.year}/${this.calendarService.month + 1}/${this.calendarService.date} ${this.calendarService.hour}:${this.calendarService.minute}`));

        this.dateChange.emit(this.initialDate);
    }
}