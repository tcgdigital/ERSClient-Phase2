import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'map-widget',
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'map.widget.view.html',
    styleUrls: ['./map.widget.style.scss']
})

export class MapWidgetComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}