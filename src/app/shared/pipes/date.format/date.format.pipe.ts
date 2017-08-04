import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'customDate'
})
export class DateFormatterPipe implements PipeTransform {
    transform(value: string, type: string = ""): string {

        let dd = value.substr(8, 2);
        let MM = value.substr(5, 2);
        let yyyy = value.substr(0, 4);
        let date = `${dd}/${MM}/${yyyy}`;

        let time = '';

        if (type != 'short') {
            let hh = value.substr(11, 2);
            let mm = value.substr(14, 2);
            let ss = value.substr(17, 2);
            time = `${hh}:${mm}:${ss}`;
        }

        return `${date} ${time}`;
    }
} 