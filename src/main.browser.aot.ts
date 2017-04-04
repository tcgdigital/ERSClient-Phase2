// /** Angular bootstraping */
// import { platformBrowser } from '@angular/platform-browser';
// import { decorateModuleRef } from './app/shared/constants';

// /** App module
//  * our top level module that holds all of our components
//  */
// import { AppModuleNgFactory } from '../compiled/src/app/app.module.ngfactory';

// /** App module
//  * our top level module that holds all of our components
//  */
// export function main(): Promise<any> {
//     return platformBrowser()
//         .bootstrapModuleFactory(AppModuleNgFactory)
//         .then(decorateModuleRef)
//         .catch((err) => console.error(err));
// }

// export function bootstrapDomReady() {
//     document.addEventListener('DOMContentLoaded', main);
// }

// bootstrapDomReady();