import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Routes, Router,ActivatedRoute  } from '@angular/router';
//import { RAGScaleService,RAGScaleModel } from "./pages/shared.components/ragscale";
import { ResponseModel } from "./shared";

import {
    GlobalStateService,
    ImageLoaderService,
    ThemeSpinnerService,
    ThemePreloaderService,
    SideMenuService,
    UtilityService
} from './shared/services';
import { MENU } from './app.memu';
import { LayoutPaths } from './shared/constants';

@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,

    templateUrl: './app.view.html',
    styleUrls: ['./app.style.scss']
})
export class AppComponent implements OnInit {
    isMenuCollapsed: boolean = false;

    constructor(private globalState: GlobalStateService,
        private route: ActivatedRoute,
        private imageLoader: ImageLoaderService,
        private spinner: ThemeSpinnerService,
        private menuService: SideMenuService
    ) {
        this.menuService.updateMenuByRoutes(MENU as Routes);
        this.LoadImages();

        this.globalState.Subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });
    }

    

    public ngOnInit(): void {
        console.log('Initial App State');
        let id = this.route.snapshot.paramMap.get('id');

    }

    public ngAfterViewInit(): void {
        // hide spinner once all loaders are completed
        ThemePreloaderService.Load()
            .then((values) => {
                console.log(values);
                this.spinner.Hide();
            }).catch((error) => {
                console.log(error);
            });
    }

    private LoadImages(): void {
        // register some loaders
        ThemePreloaderService.RegisterLoader(this.imageLoader
            .Load(LayoutPaths.images.root + 'sky-bg.jpg'));
    }


}