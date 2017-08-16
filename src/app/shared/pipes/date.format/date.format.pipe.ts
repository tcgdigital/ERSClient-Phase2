import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment/moment';

@Pipe({
    name: 'customDate'
})
export class DateFormatterPipe implements PipeTransform {
    transform(value: string, format: string = ""): string {

        // let dd = value.substr(9, 2);
        // let MMM = value.substr(5, 3);
        // let yyyy = value.substr(0, 4);
        // let date = `${dd}-${MMM}-${yyyy}`;

        // let time = '';

        // if (format != 'short') {
        //     let hh = value.substr(11, 2);
        //     let mm = value.substr(14, 2);
        //     let ss = value.substr(17, 2);
        //     time = `${hh}:${mm}:${ss}`;
        // }

        return moment(value).format(format);
    }
} 