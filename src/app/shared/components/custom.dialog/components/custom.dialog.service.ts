import { Injectable, ApplicationRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { DomPortalHost, ComponentPortal } from '@angular/cdk/portal';
import { CustomDialogComponent } from '../custom.dialog.component';
import { CustomDialogsLocalConfig } from './custom.dialog.config';
import { CustomDialogResult, CustomDialogType, CustomDialogPromptResult } from './custom.dialog.types';
import { Observable } from 'rxjs';

@Injectable()
export class CustomDialogService {

    private coolDialogPortal: ComponentPortal<CustomDialogComponent>;
    private bodyPortalHost: DomPortalHost;

    constructor(
        private appRef: ApplicationRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector
    ) {
        // Create a Portal based on the CustomDialog component
        this.coolDialogPortal = new ComponentPortal(CustomDialogComponent);

        // Create a PortalHost anchored in document.body
        this.bodyPortalHost = new DomPortalHost(
            document.body,
            this.componentFactoryResolver,
            this.appRef,
            this.injector);
    }

    /**
     * Creates an alert dialog
     * @param message - text to render inside the dialog
     * @param config - optional configuration object
     */
    alert(message: string, config?: CustomDialogsLocalConfig): CustomDialogResult {
        return this.createCoolDialogComponent(CustomDialogType.Alert, message, config);
    }

    /**
     * Creates a confirm dialog
     * @param message - text to render inside the dialog
     * @param config - optional configuration object
     */
    confirm(message: string, config?: CustomDialogsLocalConfig): CustomDialogResult {
        return this.createCoolDialogComponent(CustomDialogType.Confirm, message, config);
    }

    /**
     * Creates a prompt dialog
     * @param message - text to render inside the dialog
     * @param config - optional configuration object
     */
    prompt(prompt: string, config?: CustomDialogsLocalConfig): CustomDialogResult {
        return this.createCoolDialogComponent(CustomDialogType.Prompt, prompt, config);
    }

    /**
   * Creates a dialog
   * @param type - type of the dialog: alert, confirm or prompt
   * @param message - main text to render inside the dialog
   * @param config - optional configuration object
   */
    private createCoolDialogComponent(
        type: CustomDialogType,
        message: string,
        config?: CustomDialogsLocalConfig): CustomDialogResult {
        const componentRef = this.bodyPortalHost.attachComponentPortal(this.coolDialogPortal);
        const customDialog = componentRef.instance as CustomDialogComponent;
        customDialog.message = message;
        customDialog.localConfig = config;
        customDialog.type = type;
        // subscribe to the dialog closing event so that the portal can actually be detached
        const subscription = customDialog.$close
            .subscribe((res: boolean | CustomDialogPromptResult) => {
                this.bodyPortalHost.detach();
                subscription.unsubscribe();
            });
        return new Observable(observer => {
            // subscribe to the dialog closing event to forward the event to the caller
            const _subscription = customDialog.$close
                .subscribe((res: boolean | CustomDialogPromptResult) => {
                    _subscription.unsubscribe();
                    observer.next(res);
                });
        });
    }
}