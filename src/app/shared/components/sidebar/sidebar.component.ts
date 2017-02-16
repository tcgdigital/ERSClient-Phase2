import { Component, ElementRef, HostListener, 
    ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
import { GlobalStateService } from '../../services';
import { LayoutSizes } from '../../constants';

import 'style-loader!./sidebar.style.scss';

@Component({
    selector: 'side-bar',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './sidebar.view.html'
})
export class SidebarComponent implements OnInit, AfterViewInit {
    public menuHeight: number;
    public isMenuCollapsed: boolean = false;
    public isMenuShouldCollapsed: boolean = false;

    constructor(private elementRef: ElementRef, private globalState: GlobalStateService) {
        this.globalState.Subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });
    }

    public ngOnInit(): void {
        if (this.ShouldMenuCollapse()) {
            this.MenuCollapse();
        }
    }

    public ngAfterViewInit(): void {
        setTimeout(() => this.UpdateSidebarHeight());
    }

    public MenuExpand(): void {
        this.MenuCollaseStateChange(false);
    }

    public MenuCollapse(): void {
        this.MenuCollaseStateChange(true);
    }

    public MenuCollaseStateChange(isCollapsed: boolean): void {
        this.isMenuCollapsed = isCollapsed;
        this.globalState.NotifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    }

    public UpdateSidebarHeight(): void {
        // TODO: get rid of magic 84 constant
        this.menuHeight = this.elementRef.nativeElement.childNodes[0].clientHeight - 84;
    }

    @HostListener('window:resize')
    public OnWindowResize(): void {
        let isMenuShouldCollapsed = this.ShouldMenuCollapse();
        if (this.isMenuShouldCollapsed !== isMenuShouldCollapsed) {
            this.MenuCollaseStateChange(isMenuShouldCollapsed);
        }
        this.isMenuShouldCollapsed = isMenuShouldCollapsed;
        this.UpdateSidebarHeight();
    }

    private ShouldMenuCollapse(): boolean {
        return window.innerWidth <= LayoutSizes.resWidthCollapseSidebar;
    }
}