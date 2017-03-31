import { Component, ViewEncapsulation, OnInit } from '@angular/core';

@Component({
    selector: '[command-header]',
    templateUrl: './command.header.view.html',
    styleUrls: ['./command.header.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CommandHeaderComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}