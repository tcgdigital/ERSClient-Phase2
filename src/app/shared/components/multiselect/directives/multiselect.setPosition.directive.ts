import { Directive, OnInit, OnChanges, Input, ElementRef, SimpleChanges } from '@angular/core';

@Directive({ selector: '[setPosition]' })
export class SetPositionDirective implements OnInit, OnChanges {
    @Input('setPosition') height: number;
    
    constructor(public _elementReferance: ElementRef) { }

    ngOnInit(): void {
        if (this.height) {
            this._elementReferance.nativeElement.style.bottom = parseInt(this.height + 15 + '') + 'px';
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.height) {
            this._elementReferance.nativeElement.style.bottom = parseInt(this.height + 15 + '') + 'px';
        }
    }
}