import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { SideMenuService } from '../shared';
import { PAGES_MENU } from './pages.menu';

@Component({
    selector: 'pages',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './pages.view.html',
    providers: []
})
export class PagesComponent implements OnInit {
    sideMenuState: boolean = false;

    /**
     * Creates an instance of PagesComponent.
     * @param {SideMenuService} sideMenuService 
     * 
     * @memberOf PagesComponent
     */
    constructor(private sideMenuService: SideMenuService) { }

    ngOnInit(): void {
        this.sideMenuService.updateMenuByRoutes(<Routes>PAGES_MENU)
    }

    toggleSideMenu($event): void {
        console.log('toggle side menu click');
        this.sideMenuState = !this.sideMenuState;
    }
}