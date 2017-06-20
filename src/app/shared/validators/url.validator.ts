import { AbstractControl } from "@angular/forms";

export class URLValidator {
    public static validate(c: AbstractControl) {
        let URL_REGEXP = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\~\+#]*[\w\-\@?^=%&amp;\~\+#])?$/;

        return URL_REGEXP.test(c.value) ? null : {
            validateURL: {
                valid: false
            }
        };
    }
}