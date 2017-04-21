import { NgModule } from '@angular/core';
import { BaseModel, KeyValue } from '../../../shared';

export class NotifyPeopleModel extends BaseModel {
    public id: number;
    public text: string;
    public population: string;
    public checked: boolean;
    public children: NotifyPeopleModel[];

    constructor() {
        super();
        this.id = 0;
        this.text = '';
        this.population = '';
        this.checked = false;
        this.children = [];
    }
}



