import { AbstractControl } from "@angular/forms";

export class UserIdValidator {
    public static validate(c: AbstractControl) {
        let USERID_REGEXP = /^[a-zA-Z0-9_]*$/;

        return USERID_REGEXP.test(c.value) ? null : {
            validateUserId: {
                valid: false
            }
        };
    }
}