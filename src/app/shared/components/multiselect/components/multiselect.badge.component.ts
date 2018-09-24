import { Component, OnInit, TemplateRef, ContentChild } from '@angular/core';

@Component({
    selector: 'c-badge',
    template: ``
})
export class BadgeComponent implements OnInit {
    @ContentChild(TemplateRef) template: TemplateRef<any>
    
    constructor() { }

    ngOnInit() { }
}