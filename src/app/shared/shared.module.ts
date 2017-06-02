import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Ng2BootstrapModule } from 'ng2-bootstrap';
import { NgSelectizeModule } from 'ng-selectize';
import { HTTP_INTERCEPTOR_PROVIDER,HTTP_INTERCEPTOR_NO_OVERRIDE_PROVIDER } from './interceptor';
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
    CustomDropdownComponent,
    MapWidgetComponent,
    WeatherWidgetComponent
} from './components';

import {
    SlimScrollDirective,
    ScrollPositionDirective,
    ThemeRunDirective,
    DateTimePickerDirective
} from './directives';

import {
    EmailValidator,
    EqualPasswordsValidator
} from './validators';

import {
    AuthGuardService,
    SideMenuService,
    GlobalStateService,
    DataExchangeService,
    DataProcessingService,
    DataServiceFactory,
    ImageLoaderService,
    ThemePreloaderService,
    ThemeSpinnerService,
    ThemeConfigProviderService,
    LocationService,
    FileStoreService,
    LicensingService

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
    CustomDropdownComponent,
    MapWidgetComponent,
    WeatherWidgetComponent
];

const SHARED_DIRECTIVES: any[] = [
    SlimScrollDirective,
    ScrollPositionDirective,
    ThemeRunDirective,
    DateTimePickerDirective
];

const SHARED_SERVICES: any[] = [
    AuthGuardService,
    SideMenuService,
    ImageLoaderService,
    ThemePreloaderService,
    ThemeSpinnerService,
    ThemeConfigProviderService,
    GlobalStateService,
    DataProcessingService,
    DataServiceFactory,
    DataExchangeService,
    LocationService,
    FileStoreService,
    LicensingService,
    ENV_PROVIDERS,
    HTTP_INTERCEPTOR_PROVIDER,
    HTTP_INTERCEPTOR_NO_OVERRIDE_PROVIDER
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
        const moduleProvider: ModuleWithProviders = {
            ngModule: SharedModule,
            providers: [
                ...SHARED_SERVICES
            ]
        } as ModuleWithProviders;
        return moduleProvider;
    }
}