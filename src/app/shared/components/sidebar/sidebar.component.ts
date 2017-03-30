// import { Component, ElementRef, HostListener, 
//     ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
// import { GlobalStateService } from '../../services';
// import { LayoutSizes } from '../../constants';

// import 'style-loader!./sidebar.style.scss';

// @Component({
//     selector: 'side-bar',
//     encapsulation: ViewEncapsulation.None,

//     templateUrl: './sidebar.view.html'
// })
// export class SidebarComponent implements OnInit, AfterViewInit {
//     public menuHeight: number;
//     public isMenuCollapsed: boolean = false;
//     public isMenuShouldCollapsed: boolean = false;

//     constructor(private elementRef: ElementRef, private globalState: GlobalStateService) {
//         this.globalState.Subscribe('menu.isCollapsed', (isCollapsed) => {
//             this.isMenuCollapsed = isCollapsed;
//         });
//     }

//     public ngOnInit(): void {
//         if (this.ShouldMenuCollapse()) {
//             this.MenuCollapse();
//         }
//     }

//     public ngAfterViewInit(): void {
//         setTimeout(() => this.UpdateSidebarHeight());
//     }

//     public MenuExpand(): void {
//         this.MenuCollaseStateChange(false);
//     }

//     public MenuCollapse(): void {
//         this.MenuCollaseStateChange(true);
//     }

//     public MenuCollaseStateChange(isCollapsed: boolean): void {
//         this.isMenuCollapsed = isCollapsed;
//         this.globalState.NotifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
//     }

//     public UpdateSidebarHeight(): void {
//         // TODO: get rid of magic 84 constant
//         this.menuHeight = this.elementRef.nativeElement.childNodes[0].clientHeight - 84;
//     }

//     @HostListener('window:resize')
//     public OnWindowResize(): void {
//         let isMenuShouldCollapsed = this.ShouldMenuCollapse();
//         if (this.isMenuShouldCollapsed !== isMenuShouldCollapsed) {
//             this.MenuCollaseStateChange(isMenuShouldCollapsed);
//         }
//         this.isMenuShouldCollapsed = isMenuShouldCollapsed;
//         this.UpdateSidebarHeight();
//     }

//     private ShouldMenuCollapse(): boolean {
//         return window.innerWidth <= LayoutSizes.resWidthCollapseSidebar;
//     }
// }

import {
    Component, ViewEncapsulation, SimpleChange,
    OnInit, OnDestroy, Input, OnChanges, ElementRef
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { SideMenuService, GlobalStateService } from '../../services';

@Component({
    selector: 'side-bar',
    templateUrl: './sidebar.view.html',
    styleUrls: ['./sidebar.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit, OnChanges, OnDestroy {
    @Input() dockingState: boolean;

    public menuItems: any[];
    protected _menuItemsSub: Subscription;
    protected _onRouteChange: Subscription;

    constructor(private _router: Router,
        private _service: SideMenuService,
        private _state: GlobalStateService,
        private _elementRef: ElementRef) {
    }

    public ngOnInit() {
        this._onRouteChange = this._router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (this.menuItems) {
                    this.selectMenuAndNotify();
                } else {
                    // on page load we have to wait as event is fired before menu elements are prepared
                    setTimeout(() => this.selectMenuAndNotify());
                }
            }
        });
        this._menuItemsSub = this._service.menuItems.subscribe(this.updateMenu.bind(this));
    }

    public updateMenu(newMenuItems) {
        this.menuItems = newMenuItems;
        this.selectMenuAndNotify();
    }

    public hoverItem($event): void {
        // this.showHoverElem = true;
        // this.hoverElemHeight = $event.currentTarget.clientHeight;
        // // TODO: get rid of magic 66 constant
        // this.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - 66;
    }

    public toggleMenu($event): boolean {
        // let submenu = jQuery($event.currentTarget).next();

        // if (this.sidebarCollapsed) {
        //     this.expandMenu.emit(null);
        //     if (!$event.item.expanded) {
        //         $event.item.expanded = true;
        //     }
        // } else {
        //     $event.item.expanded = !$event.item.expanded;
        //     submenu.slideToggle();
        // }

        return false;
    }

    public selectMenuAndNotify(): void {
        if (this.menuItems) {
            this.menuItems = this._service.selectMenuItem(this.menuItems);
            this._state.NotifyDataChanged('menu.activeLink', this._service.getCurrentItem());
        }
    }

    public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        if (changes['dockingState'].currentValue !==
            changes['dockingState'].previousValue)
            this.toggleSideMenuDock();
    }

    public ngOnDestroy(): void {
        this._onRouteChange.unsubscribe();
        this._menuItemsSub.unsubscribe();
    }

    private toggleSideMenuDock(): void {
        let $self = $(this._elementRef.nativeElement).find('.side-menu');
        console.log($self);

        if ($(window).width() > 426) {
            $self.toggleClass('dock-menu');
            $('.body-container').toggleClass('dock-menu-enabled');
        } else {
            $self.toggle();
            // $self.find('i').toggleClass('fa-remove');
        }
    }
}