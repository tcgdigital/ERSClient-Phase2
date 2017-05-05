import { Injectable } from '@angular/core';
import { GlobalStateService } from "../../../shared";

@Injectable()
export class SharedService {

    constructor(private globalState: GlobalStateService) {}
    
    NotifyDataChanged(_event: string, value: any) {
        this.globalState.NotifyDataChanged(_event,value);
    }
    Subscribe(event: string, callback: Function) {
       this.globalState.Subscribe(event,callback);
    }

    Unsubscribe(event: string) {
        this.globalState.Unsubscribe(event);
    }

    
}