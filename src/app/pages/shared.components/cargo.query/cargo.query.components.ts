import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import {
    ResponseModel, GlobalConstants, KeyValue,
    GlobalStateService, UtilityService
} from '../../../shared';

@Component({
    selector: 'cargo-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/cargo.query.view.html'
})
export class CargoQueryComponent{
    constructor(){

    }
}