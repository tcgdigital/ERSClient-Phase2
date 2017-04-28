import {
    Component, OnInit, ViewEncapsulation, OnChanges,
    Input, Output, EventEmitter, ElementRef, SimpleChange,
    AfterContentInit, HostListener
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { KeyValue } from '../../models/base.model';

@Component({
    selector: 'custom-dropdown',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './dropdown.view.html',
    styleUrls: ['./dropdown.style.scss']
})
export class CustomDropdownComponent implements AfterContentInit, OnChanges,OnInit {
    @Input() dataItems: KeyValue[];
    @Input() initialValue: number = 0;
    @Input() placeholder: string;
    @Output() onChange: EventEmitter<KeyValue> = new EventEmitter<KeyValue>();

    private $selfElement: JQuery;
    private $placeholder: JQuery;
    private $options: JQuery;
    private value: KeyValue;
    private index: number = -1;
    protected _onRouteChange: Subscription;
    private showdropdown: boolean = false;

    /**
     * Creates an instance of CustomDropdownComponent.
     * @param {ElementRef} elementRef 
     * 
     * @memberOf CustomDropdownComponent
     */
    constructor(private elementRef: ElementRef,private _router: Router) { }
    
    ngOnInit() {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
         this._onRouteChange = this._router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if((event.url.indexOf("archivedashboard")>-1) && (this.placeholder.indexOf("Incident")>-1))
                {
                        this.showdropdown = true;
                }
                else{
                    this.showdropdown = false;
                }
            }
        });
    }

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
        debugger;
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