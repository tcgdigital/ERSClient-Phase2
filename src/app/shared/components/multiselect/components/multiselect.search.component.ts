import { Component, OnInit, TemplateRef, ContentChild } from '@angular/core';

@Component({
    selector: 'c-search',
    template: ``
})
export class SearchComponent implements OnInit {
    @ContentChild(TemplateRef) template: TemplateRef<any>
    
    constructor() { }

    ngOnInit() { }
}