import {
    Component, OnInit, AfterViewInit,
    AfterContentInit, ElementRef, Input,
    ViewEncapsulation
} from '@angular/core';

@Component({
    selector: 'responsive-table',
    templateUrl: './responsive.table.view.html',
    styleUrls: ['./responsive.table.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ResponsiveTableComponent implements AfterContentInit {
    @Input() isbordered: boolean = false;
    @Input() isStriped: boolean = false;
    @Input() isHoverable: boolean = true;

    /*
    Available classes are as follows
    1. ''-Default
    2. 'table-mc-red'-red
    3. 'table-mc-pink'-pink
    4. 'table-mc-purple'-purple
    5. 'table-mc-deep-purple'-deep purple
    6. 'table-mc-indigo'-indigo
    7. 'table-mc-blue'-blue
    8. 'table-mc-light-blue'-light blue
    9. 'table-mc-cyan'-cyan
    11. 'table-mc-teal'-teal
    12. 'table-mc-green'-green
    13. 'table-mc-light-green'-light green
    14. 'table-mc-lime'-lime
    15. 'table-mc-yellow'-yellow
    16. 'table-mc-amber'-amber
    17. 'table-mc-orange'-orange
    18. 'table-mc-deep-orange'-deep orange
    */
    @Input() hoverStyle: string = 'table-mc-light-blue';

    constructor(private elementRef: ElementRef) { }

    public ngAfterContentInit(): void {
        this.initiateResponsiveTable();
    }

    private initiateResponsiveTable(): void {
        let $table = jQuery(this.elementRef.nativeElement).find('table');
        $table.addClass('table');

        if (this.isbordered) {
            // this.removeCalss.call($table, 'table-bordered');
            $table.addClass('table-bordered');
        }
        if (this.isStriped) {
            $table.addClass('table-striped');
        }
        if (this.isHoverable) {
            $table.addClass('table-hover');
            $table.addClass(this.hoverStyle);
        }
    }

    private removeCalss(elements: any, value: string): void {
        for (let i = 0, l = elements.length; i < l; i++) {
            let elem = elements[i];
            if (elem.nodeType === 1 && elem.className) {
                let classNames = elem.className.split(/\s+/);

                for (let n = classNames.length; n--;) {
                    if (value.match(classNames[n])) {
                        classNames.splice(n, 1);
                    }
                }
                elem.className = jQuery.trim(classNames.join(' '));
            }
        }
    }
}