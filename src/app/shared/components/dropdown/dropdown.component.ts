import {
    Component, OnInit, ViewEncapsulation, OnChanges,
    Input, Output, EventEmitter, ElementRef, SimpleChange,
    AfterContentInit, HostListener
} from '@angular/core';
import { KeyValue } from '../../models/base.model';

@Component({
    selector: 'custom-dropdown',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './dropdown.view.html',
    styleUrls: ['./dropdown.style.scss']
})
export class CustomDropdownComponent implements AfterContentInit, OnChanges {
    @Input() dataItems: KeyValue[];
    @Input() initialValue: number = 0;
    @Input() placeholder: string;
    @Output() onChange: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();

    private $selfElement: JQuery;
    private $placeholder: JQuery;
    private $options: JQuery;
    private value: KeyValue;
    private index: number = -1

    /**
     * Creates an instance of CustomDropdownComponent.
     * @param {ElementRef} elementRef 
     * 
     * @memberOf CustomDropdownComponent
     */
    constructor(private elementRef: ElementRef) { }

    public ngAfterContentInit(): void {
        this.$selfElement = jQuery(this.elementRef.nativeElement);
        debugger;
        this.$placeholder = this.$selfElement.find('span');
        this.$options = this.$selfElement.find('ul.dropdown > li');
    }

    public onDropdownClick($event: JQueryEventObject): void {
        let $self = jQuery($event.currentTarget);
        $self.toggleClass('active');
        return;
    }

    public onItemClick($event: JQueryEventObject, dataItem: KeyValue): void {
        let $self = jQuery($event.currentTarget);
        this.value = dataItem;
        this.index = $self.index();
        this.$placeholder.text(`${this.placeholder}: ${this.value.Key.substring(0, 10)}`);
        this.onChange.emit(dataItem);
    }

    public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        if (this.initialValue > 0 && this.dataItems.length > 0
            && changes['initialValue'].currentValue !== changes['initialValue'].previousValue) {
            let selected: KeyValue = this.dataItems.find(x => x.Value === this.initialValue);
            this.$placeholder.text(`${this.placeholder}: ${selected.Key.substring(0, 10)}`);
        }
    }

    @HostListener('document:click', ['$event'])
    onDocunentClick(event) {
        let clickedComponent = event.target;
        let inside = false;
        do {
            if (this.elementRef.nativeElement.contains(clickedComponent) ||
            this.elementRef.nativeElement === clickedComponent) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
        if (inside === false) {
            // console.log("clicked outside");
            // jQuery(this.elementRef.nativeElement).removeClass('active');
        }
    }
}