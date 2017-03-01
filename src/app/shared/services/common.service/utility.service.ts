import { URLSearchParams } from '@angular/http';
import { KeyValue } from '../../models';

export class UtilityService {
    public static IsEmptyObject = (obj: {}): boolean => Object.keys(obj).length === 0 && obj.constructor === Object;

    public static IsEmptyArray = (obj: any[]): boolean => obj.length > 0 && obj[0] !== null;

    public static GetKeyValues(obj: any): KeyValue[] {
        let keyValues: KeyValue[] = [];
        Object.keys(obj).forEach(key => {
            keyValues.push({ Key: key, Value: obj[key] });
        });
        return keyValues;
    }

    /**
     * Convert string into simple comma seperated string
     *
     * @static
     * @param {(string | string[])} input
     * @returns {string}
     *
     * @memberOf UtilityService
     */
    public static ParseStringOrStringArray(input: string | string[]): string {
        if (input instanceof Array) {
            return input.join(',');
        }
        return input as string;
    }

    /**
     * Generate Url Encoded string from an object
     *
     * @static
     * @param {{}} data
     * @returns {string}
     *
     * @memberOf UtilityService
     */
    public static ObjectToUrlEncodedString(data: {}): string {
        let params = new URLSearchParams();
        for (let key in data) {
            if (data.hasOwnProperty(key) && typeof key !== 'function') {
                params.set(key, data[key]);
            }
        }
        return params.toString();
    }

    public static SetToSession(data: {}): void {
        for (let key in data) {
            if (data.hasOwnProperty(key) && typeof key !== 'function') {
                sessionStorage.setItem(key, <string>data[key]);
            }
        }
    }

    public static GetFromSession(key: string): string {
        if (this.isSessionKeyExists(key)) {
            return sessionStorage.getItem(key);
        }
        return '';
    }

    public static RemoveFromSession(key: string): void {
        if (this.isSessionKeyExists(key)) {
            sessionStorage.removeItem(key);
        }
    }

    public static shade(color, weight) {
        return UtilityService.mix('#000000', color, weight);
    }

    public static tint(color, weight) {
        return UtilityService.mix('#ffffff', color, weight);
    }

    static hexToRgbA(hex, alpha) {
        let c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length === 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
        }
        throw new Error('Bad Hex');
    }

    public static mix(color1, color2, weight) {
        let d2h = (d) => d.toString(16);
        let h2d = (h) => parseInt(h, 16);

        let result = '#';
        for (let i = 1; i < 7; i += 2) {
            let color1Part = h2d(color1.substr(i, 2));
            let color2Part = h2d(color2.substr(i, 2));
            let resultPart = d2h(Math.floor(color2Part + (color1Part - color2Part) * (weight / 100.0)));
            result += ('0' + resultPart).slice(-2);
        }
        return result;
    }

    public static UUID(): string {
        if (typeof (window) !== "undefined" && typeof (window.crypto) !== "undefined" && typeof (window.crypto.getRandomValues) !== "undefined") {
            let buf: Uint16Array = new Uint16Array(8);
            window.crypto.getRandomValues(buf);
            return (this.pad4(buf[0]) + this.pad4(buf[1]) + "-" + this.pad4(buf[2]) + "-" + this.pad4(buf[3]) + "-" + this.pad4(buf[4]) + "-" + this.pad4(buf[5]) + this.pad4(buf[6]) + this.pad4(buf[7]));
        } else {
            return this.random4() + this.random4() + "-" + this.random4() + "-" + this.random4() + "-" +
                this.random4() + "-" + this.random4() + this.random4() + this.random4();
        }
    }

    private static pad4(num: number): string {
        let ret: string = num.toString(16);
        while (ret.length < 4) {
            ret = "0" + ret;
        }
        return ret;
    }

    private static random4(): string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    private static listAllSessionItems() {
        let keys: string[] = new Array<string>();
        for (let i = 0; i <= sessionStorage.length - 1; i++) {
            keys.push(sessionStorage.key(i));
        }
        return keys;
    }

    private static isSessionKeyExists(key: string): boolean {
        let keys: string[] = this.listAllSessionItems();
        return (keys.some((x: string) => x === key))
    }

    


    /**
     * Color Helpers
     */


}