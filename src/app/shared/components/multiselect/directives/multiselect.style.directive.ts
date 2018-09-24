import { Directive, Input, ElementRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Directive({ selector: '[styleProp]' })
export class StyleDirective implements OnInit, OnChanges {
    @Input('styleProp') styleVal: number;
    
    constructor(private _elementReferance: ElementRef) { }

    ngOnInit(): void {
        this._elementReferance.nativeElement.style.top = this.styleVal;
    }
    ngOnChanges(changes: SimpleChanges): void {
        this._elementReferance.nativeElement.style.top = this.styleVal;
    }
}