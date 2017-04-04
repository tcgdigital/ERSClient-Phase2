import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Ng2BootstrapModule } from 'ng2-bootstrap';
import { NgSelectizeModule } from 'ng-selectize';

import {
    PaddingFormatterPipe
} from './pipes';

import {
    BrandHeaderComponent,
    CommandHeaderComponent,
    PageHeaderComponent,
    SidebarComponent,
    SideMenuItemComponent,
    PageFooterComponent,
    ContentHeaderComponent,
    TopMenuComponent,
    AutocompleteComponent,
    GenericSearchComponent,
    TextAccordionComponent,
    TabControlComponent,
    ResponsiveTableComponent,
    CustomDropdownComponent
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
    PageHeaderComponent,
    SidebarComponent,
    SideMenuItemComponent,
    PageFooterComponent,
    ContentHeaderComponent,
    TopMenuComponent,
    AutocompleteComponent,
    GenericSearchComponent,
    TextAccordionComponent,
    TabControlComponent,
    ResponsiveTableComponent,
    CustomDropdownComponent
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

const SHARED_PIPES: any[] = [
    PaddingFormatterPipe
];

@NgModule({
    declarations: [
        BrandHeaderComponent,
        CommandHeaderComponent,
        ...SHARED_COMPONENTS,
        ...SHARED_DIRECTIVES,
        ...SHARED_PIPES
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        NgSelectizeModule,
        Ng2BootstrapModule.forRoot()
    ],
    exports: [
        ...SHARED_COMPONENTS,
        ...SHARED_DIRECTIVES,
        ...SHARED_PIPES
    ],
     providers: [
         DataExchangeService
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