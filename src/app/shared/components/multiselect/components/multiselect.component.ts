import {
    Component, OnInit, forwardRef, OnChanges,
    AfterViewChecked, Input, EventEmitter, Output,
    ContentChild, ElementRef, ViewChild, SimpleChanges, ChangeDetectorRef, DoCheck, AfterViewInit
} from '@angular/core';
import {
    NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor,
    Validator, AbstractControl, ValidationErrors
} from '@angular/forms';
import { DropdownSettings, MyException } from '../multiselect.model';
import { ItemComponent, BadgeComponent, SearchComponent } from './index';

export const DROPDOWN_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiSelectComponent),
    multi: true
};
export const DROPDOWN_CONTROL_VALIDATION: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MultiSelectComponent),
    multi: true,
}
const noop = () => {
};

@Component({
    selector: 'multiselect-dropdown',
    templateUrl: '../views/multiselect.view.html',
    host: { '[class]': 'defaultSettings.classes' },
    styleUrls: ['../styles/multiselect.style.scss'],
    providers: [DROPDOWN_CONTROL_VALUE_ACCESSOR, DROPDOWN_CONTROL_VALIDATION]
})
export class MultiSelectComponent implements
    OnInit, ControlValueAccessor, OnChanges, Validator,
    AfterViewChecked, DoCheck, AfterViewInit {

    @Input() public data: Array<any>;
    @Input() public settings: DropdownSettings;

    @Output('onSelect')
    public onSelect: EventEmitter<any> = new EventEmitter<any>();

    @Output('onDeSelect')
    public onDeSelect: EventEmitter<any> = new EventEmitter<any>();

    @Output('onSelectAll')
    public onSelectAll: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

    @Output('onDeSelectAll')
    public onDeSelectAll: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

    @Output('onOpen')
    public onOpen: EventEmitter<any> = new EventEmitter<any>();

    @Output('onClose')
    public onClose: EventEmitter<any> = new EventEmitter<any>();

    @ContentChild(ItemComponent) itemTempl: ItemComponent;
    @ContentChild(BadgeComponent) badgeTempl: BadgeComponent;
    @ContentChild(SearchComponent) searchTempl: SearchComponent;

    @ViewChild('searchInput') searchInput: ElementRef;
    @ViewChild('selectedList') selectedListElem: ElementRef;

    public selectedItems: Array<any>;
    public isActive = false;
    public isSelectAll = false;
    public groupedData: Array<any>;
    filter: any;
    public chunkArray: any[];
    public scrollTop: any;
    public chunkIndex: any[] = [];
    public cachedItems: any[] = [];
    public totalRows: any;
    public itemHeight: any = 41.6;
    public screenItemsLen: any;
    public cachedItemsLen: any;
    public totalHeight: any;
    public scroller: any;
    public maxBuffer: any;
    public lastScrolled: any;
    public lastRepaintY: any;
    public selectedListHeight: any;
    public listFilter: any;

    defaultSettings: DropdownSettings = {
        singleSelection: false,
        text: 'Select',
        enableCheckAll: true,
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: false,
        searchBy: [],
        maxHeight: 300,
        badgeShowLimit: 999999999999,
        classes: '',
        disabled: false,
        searchPlaceholderText: 'Search',
        showCheckbox: true,
        noDataLabel: 'No Data Available',
        searchAutofocus: true,
        lazyLoading: false,
        labelKey: 'itemName',
        primaryKey: 'id',
        position: 'bottom'
    }

    public parseError: boolean;

    constructor(public _elementRef: ElementRef, private cdr: ChangeDetectorRef) { }

    public ngOnInit(): void {
        this.settings = Object.assign(this.defaultSettings, this.settings);
        if (this.settings.groupBy) {
            this.groupedData = this.transformData(this.data, this.settings.groupBy);
        }
        this.totalRows = (this.data && this.data.length);
        this.cachedItems = this.data;
        this.screenItemsLen = Math.ceil(this.settings.maxHeight / this.itemHeight);
        this.cachedItemsLen = this.screenItemsLen * 3;
        this.totalHeight = this.itemHeight * this.totalRows;
        this.maxBuffer = this.screenItemsLen * this.itemHeight;
        this.lastScrolled = 0;
        this.renderChunk(0, this.cachedItemsLen / 2);
        if (this.settings.position === 'top') {
            setTimeout(() => {
                this.selectedListHeight = { val: 0 };
                this.selectedListHeight.val = this.selectedListElem.nativeElement.clientHeight;
            });
        }
    }

    public writeValue(value: any): void {
        if (value !== undefined && value !== null) {
            if (this.settings.singleSelection) {
                try {

                    if (value.length > 1) {
                        this.selectedItems = [value[0]];
                        throw new MyException(404, { 'msg': 'Single Selection Mode, Selected Items cannot have more than one item.' });
                    } else {
                        this.selectedItems = value;
                    }
                } catch (e) {
                    console.error(e.body.msg);
                }

            } else {
                if (this.settings.limitSelection) {
                    this.selectedItems = value.splice(0, this.settings.limitSelection);
                } else {
                    this.selectedItems = value;
                }
                if (this.selectedItems.length === this.data.length && this.data.length > 0) {
                    this.isSelectAll = true;
                }
            }
        } else {
            this.selectedItems = [];
        }
    }

    public registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        throw new Error("Method not implemented.");
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.data && !changes.data.firstChange) {
            if (this.settings.groupBy) {
                this.groupedData = this.transformData(this.data, this.settings.groupBy);
                if (this.data.length === 0) {
                    this.selectedItems = [];
                }
            }
        }
        if (changes.settings && !changes.settings.firstChange) {
            this.settings = Object.assign(this.defaultSettings, this.settings);
        }
    }

    public ngDoCheck(): void {
        if (this.selectedItems) {
            if (this.selectedItems.length === 0
                || this.data.length === 0
                || this.selectedItems.length < this.data.length) {
                this.isSelectAll = false;
            }
        }
    }

    validate(c: AbstractControl): ValidationErrors {
        return null;
    }

    public ngAfterViewInit(): void {
        if (this.settings.lazyLoading) {
            this._elementRef.nativeElement.getElementsByClassName('lazyContainer')[0]
                .addEventListener('scroll', this.onScroll.bind(this));
        }
    }

    public ngAfterViewChecked(): void {
        if (this.selectedListElem.nativeElement.clientHeight
            && this.settings.position === 'top' && this.selectedListHeight) {
            this.selectedListHeight.val = this.selectedListElem.nativeElement.clientHeight;
            this.cdr.detectChanges();
        }
    }

    public trackByFn(index: number, item: any) {
        return item[this.settings.primaryKey];
    }

    public onItemClick(item: any, index: number, evt: Event) {
        if (this.settings.disabled) {
            return false;
        }

        const found = this.isSelected(item);
        const limit = this.selectedItems.length < this.settings.limitSelection ? true : false;

        if (!found) {
            if (this.settings.limitSelection) {
                if (limit) {
                    this.addSelected(item);
                    this.onSelect.emit(item);
                }
            } else {
                this.addSelected(item);
                this.onSelect.emit(item);
            }

        } else {
            this.removeSelected(item);
            this.onDeSelect.emit(item);
        }
        if (this.isSelectAll || this.data.length > this.selectedItems.length) {
            this.isSelectAll = false;
        }
        if (this.data.length === this.selectedItems.length) {
            this.isSelectAll = true;
        }
    }

    public onScroll(e: any) {
        this.scrollTop = e.target.scrollTop;
        this.updateView(this.scrollTop);
    }

    public updateView(scrollTop: any) {
        const scrollPos = scrollTop ? scrollTop : 0;
        let first = (scrollPos / this.itemHeight) - this.screenItemsLen;
        const firstTemp = '' + first;
        first = parseInt(firstTemp) < 0 ? 0 : parseInt(firstTemp);
        this.renderChunk(first, this.cachedItemsLen);
        this.lastRepaintY = scrollPos;
    }

    public filterInfiniteList(evt: any) {
        let filteredElems: Array<any> = [];
        this.data = this.cachedItems.slice();

        if (evt.target.value.toString() !== '') {
            this.data.filter(function (el: any) {
                for (const prop in el) {
                    if (el[prop].toString().toLowerCase().indexOf(evt.target.value.toString().toLowerCase()) >= 0) {
                        filteredElems.push(el);
                        break;
                    }
                }
            });
            this.totalHeight = this.itemHeight * filteredElems.length;
            this.totalRows = filteredElems.length;
            this.data = [];
            this.data = filteredElems;
            this.updateView(this.scrollTop);

        } else if (evt.target.value.toString() === '' && this.cachedItems.length > 0) {
            this.data = [];
            this.data = this.cachedItems;
            this.totalHeight = this.itemHeight * this.data.length;
            this.totalRows = this.data.length;
            this.updateView(this.scrollTop);
        }
    }

    public getObjectKey(nestedObj: any, objPath: string) {
        const pathArr = objPath.split('.');
        return pathArr.reduce((obj: any, key: string) =>
            (obj && <any>obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
    }

    public toggleDropdown(evt: any) {
        if (this.settings.disabled) {
            return false;
        }
        this.isActive = !this.isActive;
        if (this.isActive) {
            if (this.settings.searchAutofocus && this.settings.enableSearchFilter && !this.searchTempl) {
                setTimeout(() => {
                    this.searchInput.nativeElement.focus();
                }, 0);
            }
            this.onOpen.emit(true);
        } else {
            this.onClose.emit(false);
        }
        evt.preventDefault();
    }

    public toggleSelectAll() {
        if (!this.isSelectAll) {
            this.selectedItems = [];
            this.selectedItems = this.data.slice();
            this.isSelectAll = true;
            this.onChangeCallback(this.selectedItems);
            this.onTouchedCallback(this.selectedItems);

            this.onSelectAll.emit(this.selectedItems);
        } else {
            this.selectedItems = [];
            this.isSelectAll = false;
            this.onChangeCallback(this.selectedItems);
            this.onTouchedCallback(this.selectedItems);

            this.onDeSelectAll.emit(this.selectedItems);
        }
    }

    private transformData(arr: Array<any>, field: any): Array<any> {
        const groupedObj: any = arr.reduce((prev: any, cur: any) => {
            if (!prev[cur[field]]) {
                prev[cur[field]] = [cur];
            } else {
                prev[cur[field]].push(cur);
            }
            return prev;
        }, {});
        const tempArr: any = [];
        Object.keys(groupedObj).map(function (x) {
            tempArr.push({ key: x, value: groupedObj[x] });
        });
        return tempArr;
    }

    private renderChunk(fromPos: any, howMany: any) {
        this.chunkArray = [];
        this.chunkIndex = [];

        let finalItem = fromPos + howMany;

        if (finalItem > this.totalRows) {
            finalItem = this.totalRows;
        }

        for (let i = fromPos; i < finalItem; i++) {
            this.chunkIndex.push((i * this.itemHeight) + 'px');
            this.chunkArray.push(this.data[i]);
        }
    }

    private isSelected(clickedItem: any) {
        let found = false;
        this.selectedItems && this.selectedItems.forEach(item => {
            if (clickedItem[this.settings.primaryKey] === item[this.settings.primaryKey]) {
                found = true;
            }
        });
        return found;
    }

    private addSelected(item: any) {
        if (this.settings.singleSelection) {
            this.selectedItems = [];
            this.selectedItems.push(item);
            this.closeDropdown();
        } else {
            this.selectedItems.push(item);
        }
        this.onChangeCallback(this.selectedItems);
        this.onTouchedCallback(this.selectedItems);
    }

    private removeSelected(clickedItem: any) {
        this.selectedItems && this.selectedItems.forEach(item => {
            if (clickedItem[this.settings.primaryKey] === item[this.settings.primaryKey]) {
                this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
            }
        });
        this.onChangeCallback(this.selectedItems);
        this.onTouchedCallback(this.selectedItems);
    }

    private closeDropdown() {
        if (this.searchInput && this.settings.lazyLoading) {
            this.searchInput.nativeElement.value = '';
            this.data = [];
            this.data = this.cachedItems;
            this.totalHeight = this.itemHeight * this.data.length;
            this.totalRows = this.data.length;
            this.updateView(this.scrollTop);
        }
        if (this.searchInput) {
            this.searchInput.nativeElement.value = '';
        }
        this.filter = '';
        this.isActive = false;
        this.onClose.emit(false);
    }

    private onTouchedCallback: (_: any) => void = noop;

    private onChangeCallback: (_: any) => void = noop;
}