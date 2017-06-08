import { AbstractControl } from "@angular/forms";

export class NameValidator {
    public static validate(c: AbstractControl) {
        let NAME_REGEXP = /^[a-zA-Z\s]*$/;

        return NAME_REGEXP.test(c.value) ? null : {
            validateName: {
                valid: false
            }
        };
    }
}