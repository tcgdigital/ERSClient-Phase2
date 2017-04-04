import {
    Component, OnInit, ViewEncapsulation,
    Input, Output, EventEmitter, ElementRef,
    AfterContentInit
} from '@angular/core';
import { KeyValue } from '../../models/base.model';

@Component({
    selector: 'custom-dropdown',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './dropdown.view.html',
    styleUrls: ['./dropdown.style.scss']
})
export class CustomDropdownComponent implements AfterContentInit {
    @Input() dataItems: KeyValue[];
    @Input() placeholder: string;
    @Output() onChange: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();

    private $selfElement: JQuery;
    private $placeholder: JQuery;
    private $options: JQuery;
    private value: KeyValue;
    private index: number = -1

    constructor(private elementRef: ElementRef) { }

    public ngAfterContentInit(): void {
        this.$selfElement = jQuery(this.elementRef.nativeElement);
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
        this.$placeholder.text(`${this.placeholder}: ${this.value.Key.substring(0,10)}`);
        this.onChange.emit(dataItem);
    }
}