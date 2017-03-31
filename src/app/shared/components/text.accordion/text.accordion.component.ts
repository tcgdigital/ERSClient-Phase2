import {
    Component, ViewEncapsulation, OnInit, AfterViewInit,
    Input, Output, EventEmitter, ElementRef
} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TextAccordionModel } from './text.accordion.model';

@Component({
    selector: 'text-accordion',
    templateUrl: './text.accordion.view.html',
    styleUrls: ['./text.accordion.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TextAccordionComponent implements OnInit, AfterViewInit {
    @Input() accordionItems: Observable<TextAccordionModel[]>;

    constructor(private _elementRef: ElementRef) {
    }

    public ngOnInit(): void {
        // assignClassToItems();
    }

    public ngAfterViewInit(): void {
        let $self = jQuery(this._elementRef.nativeElement);
        let $itemRoot = $self.find('.cd-item-wrapper');
        let $galleryItems = $itemRoot.children('li');
    }

    public onMouseEnter($event): void {
        let $this = jQuery($event.currentTarget).children('.cd-item-wrapper');
        this.updateNavigation($this.siblings('nav').find('.cd-item-navigation').eq(0), $this);
    }

    public onMouseLeave($event): void {
        let $this = jQuery($event.currentTarget).children('.cd-item-wrapper');
        this.hideNavigation($this.siblings('nav').find('.cd-item-navigation').eq(0));
    }

    public onPreviousClick($event): void {
        let $navigationAnchor = jQuery($event.currentTarget);
        let $activeContainer = $navigationAnchor.parents('nav').eq(0).siblings('.cd-item-wrapper');

        this.showPreviousSlide($activeContainer);
        this.updateNavigation($navigationAnchor.parents('.cd-item-navigation').eq(0), $activeContainer);
    }

    public onNextClick($event): void {
        let $navigationAnchor = jQuery($event.currentTarget);
        let $activeContainer = $navigationAnchor.parents('nav').eq(0).siblings('.cd-item-wrapper');

        this.showNextSlide($activeContainer);
        this.updateNavigation($navigationAnchor.parents('.cd-item-navigation').eq(0), $activeContainer);
    }

    private showNextSlide($container): void {
        let $itemToHide = $container.find('.cd-item-front'),
            $itemToShow = $container.find('.cd-item-middle'),
            $itemMiddle = $container.find('.cd-item-back'),
            $itemToBack = $container.find('.cd-item-out').eq(0);

        $itemToHide.addClass('move-right').removeClass('cd-item-front')
            .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                $itemToHide.addClass('hidden');
            });

        $itemToShow.addClass('cd-item-front').removeClass('cd-item-middle');
        $itemMiddle.addClass('cd-item-middle').removeClass('cd-item-back');
        $itemToBack.addClass('cd-item-back').removeClass('cd-item-out');
    }

    private showPreviousSlide($container): void {
        let $itemToMiddle = $container.find('.cd-item-front'),
            $itemToBack = $container.find('.cd-item-middle'),
            $itemToShow = $container.find('.move-right').slice(-1),
            $itemToOut = $container.find('.cd-item-back');

        $itemToShow.removeClass('hidden').addClass('cd-item-front');
        $itemToMiddle.removeClass('cd-item-front').addClass('cd-item-middle');
        $itemToBack.removeClass('cd-item-middle').addClass('cd-item-back');
        $itemToOut.removeClass('cd-item-back').addClass('cd-item-out');

        let stop = Observable.interval(100)
            .subscribe(() => {
                if (!$itemToShow.hasClass('hidden')) {
                    $itemToShow.removeClass('move-right');
                    stop.unsubscribe();
                }
            });
    }

    private updateNavigation($navigation, $container): void {
        let $isNextActive = ($container.find('.cd-item-middle').length > 0) ? true : false,
            $isPrevActive = ($container.children('li').eq(0).hasClass('cd-item-front')) ? false : true;

        ($isNextActive) ? 
            $navigation.find('a').eq(1).addClass('visible') : 
            $navigation.find('a').eq(1).removeClass('visible');

        ($isPrevActive) ? 
            $navigation.find('a').eq(0).addClass('visible') : 
            $navigation.find('a').eq(0).removeClass('visible');
    }

    private hideNavigation($navigation) {
        $navigation.find('a').removeClass('visible');
    }
}