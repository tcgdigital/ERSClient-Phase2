import { AbstractControl } from '@angular/forms';
import { GlobalConstants } from '../constants/constants';

export class URLValidator {
    public static validate(c: AbstractControl) {

        let urlPattern = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\~\+#]*[\w\-\@?^=%&amp;\~\+#])?$/;
        //const urlPattern: RegExp = new RegExp(GlobalConstants.URL_PATTERN, 'ig') ;
        return urlPattern.test(c.value) ? null : {
            validateURL: {
                valid: false
            }
        };
    }
}