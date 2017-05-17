import { ValidatorFn } from '@angular/forms/src/directives/validators';
import { AbstractControl } from '@angular/forms';

export function CompareFieldValidator(valueToCompare: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const name = control.value;
        return name != valueToCompare ? { isEqual: false } : null;
    };
}