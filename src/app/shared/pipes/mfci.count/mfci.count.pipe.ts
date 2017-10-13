import { Pipe, PipeTransform } from '@angular/core';
import { KeyValue } from '../../../shared';

@Pipe({
    name: 'mfcicount'
})

export class MfciCountPipe implements PipeTransform {
    transform(items: KeyValue[], args: string): any {
        debugger;
        if (items.length > 0) {
            let result: KeyValue = items.find(item => item.Key === args);
            if (result)
                return result.Value;
            else
                return 0;
        }
        else {
            return 0;
        }
    }
}