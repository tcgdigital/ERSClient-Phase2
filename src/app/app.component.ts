import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Routes } from '@angular/router';
import { RAGScaleService,RAGScaleModel } from "./pages/shared.components/ragscale";
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

// import 'style-loader!./app.style.scss';
// import 'style-loader!./theme/initial.scss';

@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    providers:[
        RAGScaleService
    ],
    templateUrl: './app.view.html',
    styleUrls:['./app.style.scss']
})
export class AppComponent implements OnInit {
    isMenuCollapsed: boolean = false;

    constructor(private globalState: GlobalStateService,
        private imageLoader: ImageLoaderService,
        private spinner: ThemeSpinnerService,
        private menuService: SideMenuService,
        private ragScaleService:RAGScaleService
    ) {
        this.menuService.updateMenuByRoutes(<Routes>MENU);
        this.LoadImages();

        this.globalState.Subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });
    }

    public ngOnInit(): void {
        console.log('Initial App State');
        this.getRAGScaleData();
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

    private getRAGScaleData() {
        this.ragScaleService.GetAllActive()
        .subscribe((item:ResponseModel<RAGScaleModel>)=>{
            UtilityService.RAGScaleData=item.Records;
        });
    }
}