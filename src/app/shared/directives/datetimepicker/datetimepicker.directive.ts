import {
    Directive, ElementRef, EventEmitter, Renderer,
    Input, Output, AfterViewInit
} from '@angular/core';

// import { CalendarComponent, CalendarOptions } from '../../components/calendar';
import {
    DateTimePickerOptions, DateTimePickerSelectEventArgs,
    DateTimePickerChangeMonthEventArgs, DateTimePickerRenderCellEventArgs
} from './datetimepicker.model';

@Directive({ selector: '[datetime-picker]' })
export class DateTimePickerDirective implements AfterViewInit {
    @Input() options: DateTimePickerOptions;

    @Output() selectHandler: EventEmitter<DateTimePickerSelectEventArgs>
    = new EventEmitter<DateTimePickerSelectEventArgs>();

    @Output() showHandler: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() hideHandler: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output() changeMonthHandler: EventEmitter<DateTimePickerChangeMonthEventArgs>
    = new EventEmitter<DateTimePickerChangeMonthEventArgs>();
    @Output() changeYearHandler: EventEmitter<number> = new EventEmitter<number>();
    @Output() changeViewHandler: EventEmitter<string> = new EventEmitter<string>();
    @Output() renderCellHandler: EventEmitter<DateTimePickerRenderCellEventArgs>
    = new EventEmitter<DateTimePickerRenderCellEventArgs>();


    /**
     * Creates an instance of DateTimePickerDirective.
     * @param {ElementRef} elementRef
     * @param {Renderer} renderer
     *
     * @memberOf DateTimePickerDirective
     */
    constructor(private elementRef: ElementRef, private renderer: Renderer ) {
    }

    public ngAfterViewInit(): void {
        let $self: JQuery = jQuery(this.elementRef.nativeElement);
        this.addPickerIcon($self);
        let options: DateTimePickerOptions = Object.assign(new DateTimePickerOptions(), this.options);

        options.onSelect = (formattedDate: string, date: Date | Date[], inst: Object) => {
            let args: DateTimePickerSelectEventArgs = new DateTimePickerSelectEventArgs();
            args.FormattedDate = formattedDate;
            args.SelectedDate = date;

            if (this.elementRef.nativeElement)
                this.renderer.setElementProperty(this.elementRef.nativeElement, 'value', formattedDate);
            this.selectHandler.emit(args);
        };

        options.onShow = (inst: Object, animationCompleted: boolean) => {
            this.showHandler.emit(animationCompleted);
        };

        options.onHide = (inst: Object, animationCompleted: boolean) => {
            this.hideHandler.emit(animationCompleted);
        };

        options.onChangeMonth = (month: number, year: number) => {
            let args: DateTimePickerChangeMonthEventArgs = new DateTimePickerChangeMonthEventArgs();
            args.Month = month;
            args.Year = year;
            this.changeMonthHandler.emit(args);
        };

        options.onChangeYear = (year: number) => {
            this.changeYearHandler.emit(year);
        };

        options.onChangeView = (view: string) => {
            this.changeViewHandler.emit(view);
        };

        options.onRenderCell = (date: Date, cellType: string) => {
            let args: DateTimePickerRenderCellEventArgs = new DateTimePickerRenderCellEventArgs();
            args.CellDate = date;
            args.CellType = cellType;
            this.renderCellHandler.emit(args);
        };
        
        let datePicker = $self.datepicker(options).data('datepicker');

        $self.closest('.input-group-addon').on('click', () => {
            if (datePicker) {
                datePicker.show();
            }
        });
    }

    private addPickerIcon($element: JQuery): void {
        $element.wrap('<div class="input-group date"></div>');
        let $root: JQuery = $element.closest('.input-group');
        $root.append(`<span class="input-group-addon">
                        <i class="fa fa-calendar" aria-hidden="true"></i>
                    </span>`);
    }
}