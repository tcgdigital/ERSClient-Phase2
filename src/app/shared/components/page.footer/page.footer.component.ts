import { Component, ViewEncapsulation, OnInit } from '@angular/core';

@Component({
    selector: '[page-footer]',
    templateUrl: 'page.footer.view.html',
    styles: ['./page.footer.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PageFooterComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}