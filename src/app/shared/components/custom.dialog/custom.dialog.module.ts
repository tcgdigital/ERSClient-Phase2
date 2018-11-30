import { NgModule, ModuleWithProviders } from '@angular/core';
import {
    CustomDialogComponent, CustomDialogService,
    CUSTOM_DIALOG_CONFIG, CustomDialogsGlobalConfig
} from './components';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        CustomDialogComponent
    ],
    exports: [
        CustomDialogComponent
    ],
    entryComponents: [
        CustomDialogComponent
    ]
})
export class CustomDialogModule {
    static forRoot(globalConfig?: CustomDialogsGlobalConfig): ModuleWithProviders {
        return {
            ngModule: CustomDialogModule,
            providers: [
                CustomDialogService,
                {
                    provide: CUSTOM_DIALOG_CONFIG,
                    useValue: globalConfig
                }
            ]
        };
    }
}
