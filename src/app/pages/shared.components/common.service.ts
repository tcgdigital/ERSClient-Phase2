import { Injectable } from '@angular/core';
import { DemandModel } from './demand';
import { ActionableModel } from './actionables'

@Injectable()
export class CommonService {

    constructor() { }

    public SetRAGStatus(model: any): string {
        let scheduleTime: number = (Number(model.scheduleTime) * 60000);
        let createdOn: number = new Date(model.createdOn).getTime();
        let currentTime: number = new Date().getTime();
        let timeDiffofCurrentMinusCreated: number = (currentTime - createdOn);
        let percentage: number = (((timeDiffofCurrentMinusCreated) * 100) / (scheduleTime));
        if (percentage < 50) {
            return 'statusGreen';
        } else if (percentage >= 100) {
            return 'statusRed';
        }
        else {
            return 'statusAmber';
        }
    }
}