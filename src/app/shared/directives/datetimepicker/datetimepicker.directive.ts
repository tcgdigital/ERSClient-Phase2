import {
    Directive, ElementRef, EventEmitter, Renderer,
    Input, Output, AfterViewInit
} from '@angular/core';

// import { CalendarComponent, CalendarOptions } from '../../components/calendar';
import {
    DateTimePickerOptions, DateTimePickerSelectEventArgs,
    DateTimePickerChangeMonthEventArgs, DateTimePickerRenderCellEventArgs
} from './datetimepicker.model';

@Directive({ 
    selector: '[datetime-picker]',
    exportAs: 'datetimepicker'
})
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

    datepickerInstance: any;


    /**
     * Creates an instance of DateTimePickerDirective.
     * @param {ElementRef} elementRef
     * @param {Renderer} renderer
     *
     * @memberOf DateTimePickerDirective
     */
    constructor(private elementRef: ElementRef, private renderer: Renderer) {
    }

    public ngAfterViewInit(): void {
        const $self: JQuery = jQuery(this.elementRef.nativeElement);
        this.addPickerIcon($self);
        const options: DateTimePickerOptions = Object.assign(new DateTimePickerOptions(), this.options);

        options.onSelect = (formattedDate: string, date: Date | Date[], inst: object) => {
            const args: DateTimePickerSelectEventArgs = new DateTimePickerSelectEventArgs();
            args.FormattedDate = formattedDate;
            args.SelectedDate = date;

            if (this.elementRef.nativeElement)
                this.renderer.setElementProperty(this.elementRef.nativeElement, 'value', formattedDate);
            this.selectHandler.emit(args);
        };

        options.onShow = (inst: object, animationCompleted: boolean) => {
            this.showHandler.emit(animationCompleted);
        };

        options.onHide = (inst: object, animationCompleted: boolean) => {
            this.hideHandler.emit(animationCompleted);
        };

        options.onChangeMonth = (month: number, year: number) => {
            const args: DateTimePickerChangeMonthEventArgs = new DateTimePickerChangeMonthEventArgs();
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
            const args: DateTimePickerRenderCellEventArgs = new DateTimePickerRenderCellEventArgs();
            args.CellDate = date;
            args.CellType = cellType;
            this.renderCellHandler.emit(args);
        };
        this.datepickerInstance = $self.datepicker(options).data('datepicker');

        $self.siblings('.input-group-addon').on('click', () => {
            if (this.datepickerInstance) {
                this.datepickerInstance.show();
            }
        });
    }

    public updateConfig(config: any){
        this.datepickerInstance.update(config);
    }

    private addPickerIcon($element: JQuery): void {
        $element.wrap('<div class="input-group date"></div>');
        const $root: JQuery = $element.closest('.input-group');
        $root.append(`<span class="input-group-addon">
                        <i class="fa fa-calendar" aria-hidden="true"></i>
                    </span>`);
    }
}