import { Component, OnInit, TemplateRef, ContentChild } from '@angular/core';

@Component({
    selector: 'c-item',
    template: ``
})
export class ItemComponent implements OnInit {
    @ContentChild(TemplateRef) template: TemplateRef<any>
    
    constructor() { }

    ngOnInit() { }
}