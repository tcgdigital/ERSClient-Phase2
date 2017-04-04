import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import {  DataExchangeService } from '../../services/data.exchange';
import { GlobalStateService } from '../../services';

@Component({
    selector: '[command-header]',
    templateUrl: './command.header.view.html',
    styleUrls: ['./command.header.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CommandHeaderComponent implements OnInit {
    incidentId : number;
    departmentId: number;   
    constructor(private dataExchange: DataExchangeService<number>, private globalState : GlobalStateService) {
        this.incidentId = 1;
        this.departmentId = 1;
     }

    onChangeIncident(value){
      this.globalState.NotifyDataChanged('incidentChange', value);
    }

    onChangeDepartment(value){
      this.globalState.NotifyDataChanged('departmentChange', value);
    }

    ngOnInit() {

     }
}