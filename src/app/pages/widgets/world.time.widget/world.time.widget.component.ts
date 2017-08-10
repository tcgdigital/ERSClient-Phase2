import {
    Component, OnInit, ViewEncapsulation,
    AfterViewInit, ElementRef, Input
} from '@angular/core';
import { TimeZone } from '../../../shared/models/base.model';
import { GlobalTimeZone } from '../../../shared/constants/timezone';

@Component({
    selector: 'world-time-widget',
    templateUrl: './world.time.widget.view.html',
    styleUrls: ['./world.time.widget.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WorldTimeWidgetComponent implements OnInit, AfterViewInit {
    @Input() Clock1TimeZoneOffset: string = '';
    @Input() Clock2TimeZoneOffset: string = '';
    @Input() Clock3TimeZoneOffset: string = '';
    public timeZones: TimeZone[];

    private isOn: boolean = false;


    constructor(private elementRef: ElementRef) {
        this.timeZones = GlobalTimeZone.TimeZones;
    }

    ngOnInit() { }

    public ngAfterViewInit(): void {
        const $currentElement = jQuery(this.elementRef.nativeElement);
        let self = this;
        let rightMergin = '';

        if (window.screen.availWidth >= 1200)
            rightMergin = '-133px';
        else if (window.screen.availWidth >= 992 && window.screen.availWidth <= 1199)
            rightMergin = '-133px';
        else if (window.screen.availWidth >= 768 && window.screen.availWidth <= 991)
            rightMergin = '-133px';
        else if (window.screen.availWidth >= 576 && window.screen.availWidth <= 767)
            rightMergin = '-133px';
        else if (window.screen.availWidth >= 425 && window.screen.availWidth <= 575)
            rightMergin = '-133px';
        else if (window.screen.availWidth >= 375 && window.screen.availWidth <= 424)
            rightMergin = '-133px';
        else if (window.screen.availWidth >= 321 && window.screen.availWidth <= 374)
            rightMergin = '-133px';
        else if (window.screen.availWidth <= 320)
            rightMergin = '-133px';

        $currentElement.find('.world-clock-opner').click(function () {
            if (!self.isOn) {
                $currentElement.find('.world-clock-container').animate({
                    right: rightMergin
                }, 500, () => {
                    self.isOn = !self.isOn;
                });
            } else {
                $currentElement.find('.world-clock-container').animate({
                    right: 0
                }, 500, () => {
                    self.isOn = !self.isOn;
                });
            }
        });

        $currentElement.find('#clock_1').jClocksGMT(
            {
                title: 'New Delhi, India',
                offset: '+5.5',
                skin: 3
            });

        $currentElement.find('#clock_2').jClocksGMT(
            {
                offset: '0',
                skin: 3
            });

        $currentElement.find('#clock_3').jClocksGMT(
            {
                title: ' Manila, Philippines',
                offset: '+8',
                skin: 3
            });
    }

    public OnZoneChange($event): void {
        const $currentElement = jQuery(this.elementRef.nativeElement);
        const $selectedElement = jQuery($event.target);
        $currentElement.find('#clock_1')
            .empty().jClocksGMT(
            {
                title: $selectedElement.find('option:selected').text(),
                offset: $selectedElement.find('option:selected').val(),
                skin: 3
            });
    }
}