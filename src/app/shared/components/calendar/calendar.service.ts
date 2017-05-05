import { Injectable } from '@angular/core';
import { CalendarDay, CalendarMonth, CalendarWeekend } from './calendar.model';

export class CalendarService {
    daysInMonth: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    days: CalendarDay[];
    year: number;
    month: number;
    date: number;
    hour: number;
    minute: number;

    /**
     * Creates an instance of CalendarService.
     * @param {Date} [date=new Date] 
     * 
     * @memberOf CalendarService
     */
    constructor(date: Date = new Date()) {
        this.year = date.getFullYear();
        this.month = date.getMonth();
        this.date = date.getDate();
        this.hour = date.getHours();
        this.minute = date.getMinutes();
        this.updateCalendar();
    }

    next() {
        this.setMonth(this.month + 1);
        this.updateCalendar();
    }

    previous() {
        this.setMonth(this.month - 1);
        this.updateCalendar();
    }

    updateCalendar() {
        this.days = [];
        let daysInMonth = this.getDaysInMonth(this.month);
        let date = new Date();
        let firstDayOfMonth = ((new Date(Date.parse(`${this.year}/${this.month + 1}/1`))).getDay() || 7) - 1; // making 0 == monday
        let weekend = new CalendarWeekend(firstDayOfMonth);

        if (firstDayOfMonth/* is not monday (0) */) {
            let daysInLastMonth = this.getDaysInMonth(this.month - 1);
            for (let date = daysInLastMonth - firstDayOfMonth; date < daysInLastMonth; date++) {
                this.days.push(new CalendarDay(date, weekend.progress(), true));
            }
        }

        for (let date = 1; date <= daysInMonth; date++) {
            this.days.push(new CalendarDay(date, weekend.progress()));
        }

        // set selected date - same as previously selected date, unless it's greater than the number of days in the month
        let selectedDate = firstDayOfMonth + this.date - 1;
        if (selectedDate > daysInMonth) {
            selectedDate = daysInMonth;
        }
        this.days[selectedDate].selected = true;
        if (date.getMonth() === this.month) {
            // set the current date if it's the current month
            this.days[firstDayOfMonth + date.getDate() - 1].current = true;
        }

        let daysSoFar = firstDayOfMonth + daysInMonth;
        for (let date: number = 1; date <= (daysSoFar > 35 ? 42 : 35) - daysSoFar; date++) {
            this.days.push(new CalendarDay(date, weekend.progress(), true));
        }
    }

    selectDate(index: number) {
        this.date = this.days[index].date;

        // might be a day from the previous/next month
        if (index < 7 && this.date > 20) {
            this.previous();
        } else if (index > 20 && this.date < 8) {
            this.next();
        } else {
            // no need to update the whole calendar here
            for (let day of this.days) {
                if (day.selected) {
                    day.selected = false;
                }
            }

            this.days[index].selected = true;
        }
    }

    setMonth(month) {
        let calendarMonth: CalendarMonth = new CalendarMonth(month, this.year);
        this.month = calendarMonth.month;
        this.year = calendarMonth.year;
    }

    getDaysInMonth(month) {
        let calendarMonth: CalendarMonth = new CalendarMonth(month, this.year);
        if (calendarMonth.month == 1 && ((calendarMonth.year % 4 == 0)
            && (calendarMonth.year % 100 != 0)) || (calendarMonth.year % 400 == 0)) {
            return 29;
        }

        return this.daysInMonth[calendarMonth.month];
    }
}