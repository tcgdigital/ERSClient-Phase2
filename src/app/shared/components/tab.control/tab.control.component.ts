import {
    Component, OnInit, Input,
    ViewEncapsulation, AfterViewInit,
    ElementRef
} from '@angular/core';
import { ITabLinkInterface } from './tab.control.interface';

@Component({
    selector: '[tab-control]',
    templateUrl: 'tab.control.view.html',
    styleUrls: ['./tab.control.style.scss'],
    encapsulation: ViewEncapsulation.None
})

export class TabControlComponent implements OnInit, AfterViewInit {
    @Input() tabLinks: ITabLinkInterface[];


    private $rootContainer: JQuery;
    private $rootItems: JQuery;
    private $tabItems: JQuery;
    private $slider: JQuery;

    /**
     * Creates an instance of TabControlComponent.
     * @param {ElementRef} elementRef 
     * 
     * @memberOf TabControlComponent
     */
    constructor(private elementRef: ElementRef) { }

    public ngOnInit(): void {
    }

    public ngAfterViewInit(): void {
        this.$rootContainer = jQuery(this.elementRef.nativeElement);
        this.$rootItems = this.$rootContainer.find('ul.tab-column');
        this.$tabItems = this.$rootItems.children('li.tab-item');
        this.$slider = this.$rootItems.find('li.slider');

        this.$rootItems.css('width', `${this.$tabItems.eq(0).width() * this.$tabItems.length}px`);

        this.$rootContainer.hover(
            ($event: JQueryEventObject) => {
                let $itemWrapper: JQuery = jQuery($event.currentTarget);
                let $navigation = $itemWrapper.find('.tab-nav');
                let $tabColumns = $itemWrapper.find('.tab-column');

                this.updateNavigation($navigation, $itemWrapper, $tabColumns);
                this.$slider.show();
            },
            ($event: JQueryEventObject) => {
                let $itemWrapper: JQuery = jQuery($event.currentTarget);
                let $navigation = $itemWrapper.find('.tab-nav');
                this.hideNavigation($navigation);
                this.$slider.hide();
            }
        );
    }

    public onTabLinkClick($event, index: number): void {
        $event.preventDefault();
        let $self: JQuery = jQuery($event.currentTarget);
        let $currentItem: JQuery = $self.parent('li.tab-item');

        this.resetSelection();
        this.setSelection($currentItem, $event.pageX, $event.pageY)
        this.$slider.hide();
    }

    public onTabItemClick($event, index: number): void {
        let $self: JQuery = jQuery($event.currentTarget);

        // this.moveSliderOnFocus($event, index);
        this.resetSelection();
        this.setSelection($self, $event.pageX, $event.pageY)
        this.$slider.hide();
    }

    public onTabLinkMouseEnter($event, index: number): void {
        let $self: JQuery = jQuery($event.currentTarget);
        this.moveSliderOnFocus($self, index);
    }

    public onTabLinkMouseLeave($event, index: number): void {
        let $self: JQuery = jQuery($event.currentTarget);
        this.moveSliderOnFocus($self, index);
    }

    public gotoPrevious($event): void {
        let $self: JQuery = jQuery($event.currentTarget);
        this.updateSlider($self, false);
    }

    public gotoNext($event): void {
        let $self: JQuery = jQuery($event.currentTarget);
        this.updateSlider($self, true);
    }

    public onContainerMouseEnter($event): void {
        // let $itemWrapper: JQuery = jQuery($event.currentTarget);
        // let $navigation = $itemWrapper.siblings('.tab-nav');
        // let $tabColumns = $itemWrapper.find('.tab-column');

        // this.updateNavigation($navigation, $itemWrapper, $tabColumns);
        // this.$slider.show();
    }

    public onContainerMouseLeave($event): void {
        // let $itemWrapper: JQuery = jQuery($event.currentTarget);
        // let $navigation = $itemWrapper.siblings('.tab-nav');
        // this.hideNavigation($navigation);
        // this.$slider.hide();
    }

    private updateSlider($currentElm, bool): void {
        let $navigation = $currentElm.closest('.tab-nav');
        let $itemWrapper = $navigation.siblings('.tab-link');
        let $tabColumns = $itemWrapper.children('.tab-column');
        let $tabItems = $tabColumns.children('li.tab-item');
        let tabWidth = $tabItems.eq(0).width();

        $tabColumns.css('width', (tabWidth * $tabItems.length) + 'px');

        let scrollLeft = $itemWrapper.scrollLeft();
        scrollLeft = isNaN(scrollLeft) ? 0 : scrollLeft;

        scrollLeft = (bool) ? scrollLeft + tabWidth : scrollLeft - tabWidth;
        if (scrollLeft < 0) scrollLeft = 0;
        if (scrollLeft > $tabColumns.outerWidth(true) - $itemWrapper.width())
            scrollLeft = $tabColumns.outerWidth(true) - $itemWrapper.width();

        $itemWrapper.animate({ scrollLeft: scrollLeft }, 200);
        this.updateNavigation($navigation, $itemWrapper, $tabColumns);
    }

    private updateNavigation($navigation, $container, $tabColumns) {
        var scrollLeft = $container.scrollLeft();
        var isPrevActive = false;
        var isNextActive = false;

        if (($tabColumns.outerWidth(true) - $container.width()) > 0) {
            isPrevActive = (scrollLeft <= 0) ? false : true;
            isNextActive = (scrollLeft == Math.floor($tabColumns.outerWidth(true) - $container.width())) ? false : true;
        }

        (isNextActive) ? $navigation.find('a').eq(1).addClass('visible') : $navigation.find('a').eq(1).removeClass('visible');
        (isPrevActive) ? $navigation.find('a').eq(0).addClass('visible') : $navigation.find('a').eq(0).removeClass('visible');
    }

    private hideNavigation($navigation) {
        $navigation.find('a').removeClass('visible');
    }

    private resetSelection(): void {
        this.$rootContainer.find('.tab-link li').removeClass('selected');
        this.$rootContainer.find('.ripple').parent('li').removeClass('selected');
        this.$rootContainer.find('.ripple').remove();
    }

    private setSelection($tabItem: JQuery, pageXPos: number, pageYPos: number): void {
        let posX: number = $tabItem.offset().left;
        let posY: number = $tabItem.offset().top;
        let buttonWidth: number = $tabItem.width();
        let buttonHeight: number = $tabItem.height();

        let x: number = pageXPos - posX - buttonWidth / 2;
        let y: number = pageYPos - posY - buttonHeight / 2;

        $tabItem.prepend("<span class='ripple'></span>");
        let $ripple: JQuery = $tabItem.find('.ripple');

        $ripple.css({
            width: buttonWidth,
            height: buttonHeight,
            top: y + 'px',
            left: x + 'px'
        }).addClass("rippleEffect");

        $ripple.parent('li').addClass('selected');
    }

    private moveSliderOnFocus($tabItem: JQuery, tabIndex: number): void {
        let whatTab: number = tabIndex;
        let howFar: number = $tabItem.width() * whatTab;

        this.$slider.show();
        this.$slider.css({ left: `${howFar}px` });
    }
}