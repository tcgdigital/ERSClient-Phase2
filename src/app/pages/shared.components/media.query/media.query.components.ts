import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import {
    ResponseModel, GlobalConstants, KeyValue,
    GlobalStateService, UtilityService
} from '../../../shared';

@Component({
    selector: 'other-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/media.query.view.html'
})
export class MediaQueryComponent{
    constructor(){

    }
}