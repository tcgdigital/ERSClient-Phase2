import { AbstractControl } from "@angular/forms";

export class UserIdValidator {
    public static validate(c: AbstractControl) {
        //let USERID_REGEXP = /^\S*$/;
        let USERID_REGEXP = /^\S{5,}$/ig;

        return USERID_REGEXP.test(c.value) ? null : {
            validateUserId: {
                valid: false
            }
        };
    }
}