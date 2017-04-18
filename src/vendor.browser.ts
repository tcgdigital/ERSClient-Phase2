// For vendors for example jQuery, Lodash, angular2-jwt just import them here unless you plan on
// chunking vendors files for async loading. You would need to import the async loaded vendors
// at the entry point of the async loaded file. Also see custom-typings.d.ts as you also need to
// run `typings install x` where `x` is your module

// Angular 2
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/forms';
import '@angular/http';
import '@angular/router';

// AngularClass
import '@angularclass/hmr';

// RxJS
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

// Web dependencies
import 'jquery';
// import 'jquery-slimscroll';
import 'selectize';
import 'bootstrap';
import 'font-awesome-sass-loader';
import 'lodash';
import 'air-datepicker';
import 'moment';
import '../node_modules/air-datepicker/dist/js/i18n/datepicker.en';
import '../node_modules/sweet-dropdown/dist/min/jquery.sweet-dropdown.min';

if ('production' === ENV) {
    // Production
} else {
    // Development
}
