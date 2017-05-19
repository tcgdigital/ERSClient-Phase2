import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'padding'
})
export class PaddingFormatterPipe implements PipeTransform {
    transform(value: any, char: string, max: number): string {
        return this.pad(value === undefined ? 0 : value, char, max);
    }

    private pad(str: any, char: string, max: number): string {
        return str.toString().length < max ? this.pad(char + str, char, max) : str;
    }
}