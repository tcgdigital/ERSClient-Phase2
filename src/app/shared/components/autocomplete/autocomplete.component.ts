import {
    Component, ViewEncapsulation,
    ElementRef, Input, Output,
    EventEmitter, HostListener
} from '@angular/core';
import { KeyValue } from '../../models';

@Component({
    selector: 'autocomplete',
    host: {
        '(document:click)': 'onDocunentClick($event)',
    },
    templateUrl: './autocomplete.view.html'
})
export class AutocompleteComponent {
    @Input('items') Items: Array<KeyValue> = [];
    @Output() notify: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();

    // public query = '';
    // public filteredList;
    public elementRef;
    public filteredList: Array<KeyValue> = [];
    public query: string = '';

    constructor(public myElement: ElementRef) {
         this.elementRef = myElement;
        this.filteredList = this.Items;
    }

    filter(): void {
        if (this.query !== null) {
            this.filteredList = this.Items.filter(function (el: KeyValue) {
                return el.Key.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
            }.bind(this));
        } else {
            this.filteredList = this.Items;
        }
        console.log('filter executed');
       
    }

    select(item: KeyValue) {
        this.query = item.Key;
        this.filteredList = [];
        this.notify.emit(item);
    }

    // @HostListener('document:click', ['$event'])
    onDocunentClick(event) {
        var clickedComponent = event.target;
        var inside = false;
        do {
            if (clickedComponent === this.elementRef.nativeElement) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
        if (!inside) {
            this.filteredList = [];
        }

    }
}

