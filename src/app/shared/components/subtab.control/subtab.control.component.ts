import { Component, OnInit, ViewEncapsulation, Input, ElementRef, SimpleChange } from '@angular/core';
import { ITabLinkInterface } from '../tab.control/tab.control.interface';
import { Router } from '@angular/router';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: '[subtab-control]',
    templateUrl: 'subtab.control.view.html',
    styleUrls: ['./subtab.control.style.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SubTabControlComponent implements OnInit, OnChanges {
    @Input('tabLinks') tabLinks: ITabLinkInterface[];
    protected allowedTabLinks: ITabLinkInterface[];

    constructor(private elementRef: ElementRef, private router: Router) {
    }

    public ngOnInit(): void {
        this.allowedTabLinks = this.tabLinks;
    }

    public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        if (changes['tabLinks'] !== undefined && (changes['tabLinks'].currentValue !==
            changes['tabLinks'].previousValue) &&
            changes['tabLinks'].previousValue !== undefined) {
            this.allowedTabLinks = this.tabLinks;
        }

    }
}