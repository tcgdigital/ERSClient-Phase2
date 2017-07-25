import {
    Component, OnInit, AfterViewInit,
    AfterContentInit, ElementRef, Input,
    ViewEncapsulation, HostListener
} from '@angular/core';

@Component({
    selector: 'responsive-table',
    templateUrl: './responsive.table.view.html',
    styleUrls: ['./responsive.table.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ResponsiveTableComponent implements AfterContentInit, AfterViewInit {
    @Input() isbordered: boolean = false;
    @Input() isStriped: boolean = false;
    @Input() isHoverable: boolean = true;
    @Input() scrollableclass: boolean = false;

    $currentElement: JQuery;

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

    public ngAfterViewInit(): void {
        this.$currentElement = jQuery(this.elementRef.nativeElement);
        const $table: JQuery = this.$currentElement.find('table.table');

        jQuery(window).unbind('scroll').scroll(() => {
            const $wrappers: JQuery = jQuery('[class*="table-responsive-vertical"]:visible');

            jQuery.each($wrappers, (index, $wrapper) => {
                const wrapperTop = jQuery($wrapper).offset().top;
                const fullHeight = jQuery($wrapper).height();
                const windowScroll = jQuery(window).scrollTop();

                const $navPrev: JQuery = jQuery($wrapper).find('a.scroll-nav.prev');
                const $navNext: JQuery = jQuery($wrapper).find('a.scroll-nav.next');
                if ((windowScroll > (wrapperTop + 100)) && (windowScroll < (fullHeight + (wrapperTop - 150)))) {
                    $navPrev.css('top', ((windowScroll - wrapperTop) + 100) + 'px');
                    $navNext.css('top', ((windowScroll - wrapperTop) + 100) + 'px');
                }
                else {
                    $navPrev.css('top', '50px');
                    $navNext.css('top', '50px');
                }
            });
        });


        // this.$currentElement.closest('[bsmodal]')
        //     .scroll((event) => {
        // const $scrollableElm: JQuery = jQuery(event.currentTarget);
        // const $navs: JQuery = this.$currentElement.find('a.scroll-nav.prev');
        // let top: number = +$navs.css('top').replace('px', '');
        // top += $scrollableElm.scrollTop();
        // $navs.css('top', `${top}px`);
        // });
    }

    public onHover($event): void {
        const $container: JQuery = this.$currentElement.find('.table-responsive-vertical');
        const $table: JQuery = $container.find('table.table');
        if ($container.width() < $table.outerWidth(true)) {
            $container.find('a.scroll-nav.prev, a.scroll-nav.next').show();
        } else {
            $container.find('a.scroll-nav.prev, a.scroll-nav.next').hide();
        }
    }

    public onPreviousNevClick($event): void {
        this.updateSlider('P');
    }

    public onNextNevClick($event): void {
        this.updateSlider('N');
    }

    // @HostListener('window:scroll', ['$event'])
    // public onWindowScroll(event): void {
    //     const $wrapper: JQuery = this.$currentElement
    //         .find('[class*="table-responsive-vertical"]');
    // }

    // @HostListener('window:scroll', ['$event'])
    // public onDocumentScroll($event): void {
    // }

    private updateSlider(position: string): void {
        const $wrapperElm: JQuery = this.$currentElement.find('.table-responsive-vertical');
        const $tableElm: JQuery = $wrapperElm.find('table.table');

        const columnWidth: number = 100;
        let scrollLeftPos: number = $wrapperElm.scrollLeft();
        scrollLeftPos = isNaN(scrollLeftPos) ? 0 : scrollLeftPos;

        scrollLeftPos = (position === 'N') ? scrollLeftPos + columnWidth : scrollLeftPos - columnWidth;
        if (scrollLeftPos < 0) scrollLeftPos = 0;
        if (scrollLeftPos > $tableElm.outerWidth(true) - $wrapperElm.width())
            scrollLeftPos = $tableElm.outerWidth(true) - $wrapperElm.width();

        $wrapperElm.animate(
            { scrollLeft: scrollLeftPos },
            {
                duration: 'slow',
                easing: 'easeInSine'
            });
    }

    private initiateResponsiveTable(): void {
        const $table = jQuery(this.elementRef.nativeElement).find('table');
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
            const elem = elements[i];
            if (elem.nodeType === 1 && elem.className) {
                const classNames = elem.className.split(/\s+/);

                for (let n = classNames.length; n--; ) {
                    if (value.match(classNames[n])) {
                        classNames.splice(n, 1);
                    }
                }
                elem.className = jQuery.trim(classNames.join(' '));
            }
        }
    }
}