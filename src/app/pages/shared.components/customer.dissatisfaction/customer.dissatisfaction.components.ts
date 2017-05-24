import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import {
    ResponseModel, GlobalConstants, KeyValue,
    GlobalStateService, UtilityService
} from '../../../shared';

@Component({
    selector: 'other-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/customer.dissatisfaction.view.html'
})
export class CustomerDissatisfactionComponent{
    constructor(){

    }
}