import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'ng2-bootstrap';

import {
    SidebarComponent,
    SideMenuComponent,
    MenuItemComponent,
    PageHeaderComponent,
    ContentHeaderComponent,
    TopMenuComponent
} from './components';

import {
    SlimScrollDirective,
    ScrollPositionDirective,
    ThemeRunDirective
} from './directives';

import {
    EmailValidator,
    EqualPasswordsValidator
} from './validators';

import {
    SideMenuService,
    GlobalStateService,
    DataExchangeService,
    DataProcessingService,
    DataServiceFactory,
    ImageLoaderService,
    ThemePreloaderService,
    ThemeSpinnerService,
    ThemeConfigProviderService
} from './services';

import {
    GlobalConstants,
    ENV_PROVIDERS,
    LayoutSizes,
    decorateModuleRef
} from './constants';

const SHARED_COMPONENTS: any[] = [
    SidebarComponent,
    SideMenuComponent,
    MenuItemComponent,
    PageHeaderComponent,
    ContentHeaderComponent,
    TopMenuComponent
];

const SHARED_DIRECTIVES: any[] = [
    SlimScrollDirective,
    ScrollPositionDirective,
    ThemeRunDirective
];

const SHARED_SERVICES: any[] = [
    SideMenuService,
    ImageLoaderService,
    ThemePreloaderService,
    ThemeSpinnerService,
    ThemeConfigProviderService,
    GlobalStateService,
    DataProcessingService,
    DataServiceFactory,
    DataExchangeService,
    ENV_PROVIDERS
];

const SHARED_VALIDATORS: any[] = [
    EmailValidator,
    EqualPasswordsValidator
];

const SHARED_CONSTANTS: any[] = [
    GlobalConstants,
    LayoutSizes,
    decorateModuleRef
];

@NgModule({
    declarations: [
        ...SHARED_COMPONENTS,
        ...SHARED_DIRECTIVES
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        DropdownModule.forRoot()
    ],
    exports: [
        ...SHARED_COMPONENTS,
        ...SHARED_DIRECTIVES
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        let moduleProvider: ModuleWithProviders = <ModuleWithProviders>{
            ngModule: SharedModule,
            providers: [
                ...SHARED_SERVICES
            ]
        };
        return moduleProvider;
    }
}