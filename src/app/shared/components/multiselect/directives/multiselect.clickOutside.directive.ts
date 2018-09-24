import { Directive, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Directive({ selector: '[clickOutside]' })
export class ClickOutsideDirective {
    @Output() public clickOutside: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

    constructor(private _elementReferance: ElementRef) { }

    @HostListener('document:click', ['$event', '$event.target'])
    @HostListener('document:touchstart', ['$event', '$event.target'])
    public onClick(event: MouseEvent, targetElement: HTMLElement){
        if(!targetElement)
            return;

        const clickedInside = this._elementReferance.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.clickOutside.emit(event);
        }
    }
}