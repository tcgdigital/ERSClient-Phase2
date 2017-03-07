import { Observable } from 'rxjs/Rx';
import { NameValue } from '../../models';

export class SearchConfigModel<T> {
    Name: string;
    Value: T;
    Description: string;
    PlaceHolder: string;
    Type: SearchControlType;
    ListData: Observable<NameValue<T>[]>;
    Order: number;

    constructor(options: {
        Name?: string,
        Value?: T,
        Description?: string,
        PlaceHolder?: string,
        Type?: SearchControlType,
        ListData?: Observable<NameValue<T>[]>,
        Order?: number
    }) {
        this.Name = options.Name || '';
        this.Value = options.Value;
        this.Description = options.Description || '';
        this.PlaceHolder = options.PlaceHolder || '';
        this.Type = options.Type || SearchControlType.TEXTBOX;
        this.ListData = options.ListData || Observable.of([]);
        this.Order = options.Order === undefined ? 1 : options.Order;
    }
}

export enum SearchControlType {
    TEXTBOX,
    DROPDOWN,
    DATEPICKER,
    DATETIMEPICKER
}