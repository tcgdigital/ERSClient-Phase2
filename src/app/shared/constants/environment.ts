import { ApplicationRef, enableProdMode } from '@angular/core';
import { disableDebugTools, enableDebugTools } from '@angular/platform-browser';

let PROVIDERS: any[] = [];
let _decorateModuleRef = <T extends {}>(value: T): T => value;

if ('production' === ENV || 'renderer' === ENV) {
    // Production
    disableDebugTools();
    enableProdMode();
}
else {
    // Development
    _decorateModuleRef = (modRef: any) => {
        const appRef = modRef.injector.get(ApplicationRef);
        const comRef = appRef.components[0];

        let _ng = (<any>window).ng;
        enableDebugTools(comRef);

        (<any>window).ng.prob = _ng.prob;
        (<any>window).ng.coreTokens = _ng.coreTokens;
        return modRef;
    };
}

PROVIDERS = [...PROVIDERS];
export const decorateModuleRef = _decorateModuleRef;
export const ENV_PROVIDERS = [...PROVIDERS];