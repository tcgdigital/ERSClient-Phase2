import {
    Component, ViewEncapsulation,
    ElementRef, Input, Output,
    EventEmitter, HostListener, OnDestroy, OnInit, SimpleChange
} from '@angular/core';
import { KeyValue } from '../../models';
import { DataExchangeService } from '../../services/data.exchange';
import { IAutocompleteActions } from './IAutocompleteActions';
import { GlobalConstants } from '../../../shared';

@Component({
    selector: 'autocomplete',
    templateUrl: './autocomplete.view.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./autocomplete.style.scss']
})
export class AutocompleteComponent implements OnInit, OnDestroy {
    @Input('items') items: Array<KeyValue> = [];
    @Input('initialvalue') initialvalue: KeyValue = new KeyValue('', 0);
    @Input() placeholder: string = 'Please select';
    @Input() actionLinks: IAutocompleteActions[] = [];

    @Output() notify: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();
    @Output('InvokeAutoCompleteReset') InvokeAutoCompleteReset: EventEmitter<any> = new EventEmitter();
    @Output() actionClickHandler: EventEmitter<any> = new EventEmitter();

    public elementRef;
    public filteredList: Array<KeyValue> = [];
    public query: string = '';

    constructor(public myElement: ElementRef, private dataExchange: DataExchangeService<string>) {
        this.elementRef = myElement;
        this.filteredList = this.items;
    }

    filter(): void {
        if (this.query != null && this.query != '') {
            this.filteredList = this.items.filter(function (el: KeyValue) {
                return el.Key.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
            }.bind(this));
        } else {
            this.filteredList = this.items;
        }
        if (this.filteredList.length == 0) {
            this.filteredList.push(new KeyValue("No Value found", 0));
        }
    }

    clear(): void {
        this.filteredList = [];
        this.query = '';
        this.InvokeAutoCompleteReset.emit();
    }

    showClose(): boolean {
        if (this.filteredList.length > 0 || this.query != '') {
            return true;
        }
        return false;
    }

    select(item: KeyValue) {
        this.query = item.Key;
        this.filteredList = [];
        this.notify.emit(item);
    }

    action_clisk(event: Event, item: KeyValue, actionName: string): void {
        event.stopPropagation();
        this.actionClickHandler.emit({ selectedItem: item, selectedAction: actionName });
    }

    @HostListener('document:click', ['$event'])
    onDocunentClick(event) {
        let clickedComponent = event.target;
        let inside = false;
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

    ngOnInit() {
        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.ClearAutoCompleteInput, (model) => this.query = model);
        if (this.items.length > 0 && this.items.find(x => x.Value == this.initialvalue.Value) != null) {
            this.query = this.initialvalue.Key;
        }
    }

    ngOnDestroy() {
        this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.ClearAutoCompleteInput);
    }


    public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        if (changes['initialvalue'] !== undefined && (changes['initialvalue'].currentValue !==
            changes['initialvalue'].previousValue)) {
            if (this.items.length > 0 && this.items.find(x => x.Value == this.initialvalue.Value) != null) {
                this.query = this.initialvalue.Key;
            }
        }
    }
}

