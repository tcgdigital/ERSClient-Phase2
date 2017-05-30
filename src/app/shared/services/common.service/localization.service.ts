import * as moment from 'moment/moment';
import { Observable } from 'rxjs/Rx';

export class LocalizationService {

    public static toLocal(date: Date): Date {
        date = new Date(date.toLocaleString() + " UTC");
        //date.setMinutes(-(new Date()).getTimezoneOffset());
        return date; // Pleasde check



    }

    public static toUTC(date: Date): Date {
        date = new Date(date.toISOString().split('.')[0]);
        //date.setMinutes((new Date()).getTimezoneOffset());
        return date; // Pleasde check
    }

    /**
     * transformRequest(request:any)
     * Scan the entire JSON request and find each DateTime field and then convert it 
     * to UTC date by calling the toUTC method.
     * 
     * @static
     * @param {*} request 
     * @returns {*} 
     * 
     * @memberof LocalizationService
     */
    public static transformRequest(request: any): any {
        if (request !== null && request !== undefined) {
            let dataString = JSON.stringify(request)
            dataString.replace(/(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d{3}))?/mgi, (mached) => {
                let existingDate = new Date(mached);
                return moment(LocalizationService.toUTC(existingDate)).toJSON();
            })
            return JSON.parse(dataString);
        }
        else {
            return request;
        }
        //return request;
    }

    public static transformRequestBody(request: string): string {
        if (request !== null && request !== undefined && request !== '') {
            request.replace(/(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d{3}))?/mgi, (mached) => {
                let existingDate: Date = new Date(new Date(mached.split('.')[0]).toLocaleString() + " UTC");
                let convertedDate: Date = LocalizationService.toUTC(existingDate);

                return LocalizationService.toJSONDate(convertedDate);
            })
            return request;
        }
        else {
            return request;
        }
        //return request;
    }

    /**
     * transformResponse(response:any)
     * Scan the entire JSON response and find each DateTime field and then convert it 
       to UTC date by calling the toUTC method.
     * 
     * @static
     * @param {*} response 
     * @returns {*} 
     * 
     * @memberof LocalizationService
     */
    public static transformResponse(response: any): any {
        if (response !== null && response !== undefined) {
            let dataString = JSON.stringify(response)
            dataString.replace(/(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d{3}))?/mgi, (mached) => {
                let existingDate = new Date(mached);
                return moment(LocalizationService.toLocal(existingDate)).toJSON();
            })
            return JSON.parse(dataString);
        }
        else {
            return response;
        }

        //return response;
    }

    public static transformResponseBody(response: string): string {
        if (response !== null && response !== undefined && response !== '') {
            response = response
                .replace(/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|[zZ]))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|[zZ]))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|[zZ]))/mgi, (mached) => {
                    let existingDate: Date = new Date(new Date(mached.split('.')[0]).toLocaleString() + " UTC");
                    let convertedDate: Date = LocalizationService.toLocal(existingDate);
                    return LocalizationService.toJSONDate(convertedDate);
                })
            return response;
        }
        else
            return response;
    }


    public static PreserveDateFromConversion(restrictedFields: string[],
        data: any, handeler: (data: any) => any): any {

        if (data instanceof Observable) {
            return data.map((value) => {
                if (value.text() !== null && value.text() !== undefined) {
                    let preserved: any = {};
                    if (restrictedFields.length > 0) {
                        let responseObject: {} = value.json();
                        if (Object.keys(responseObject).some((x) => restrictedFields.some((y) => y === x))) {
                            restrictedFields.forEach(z => {
                                preserved[z] = responseObject[z];
                            });

                            value._body = handeler(value.text());
                            let transformedResponseBodyObj: any = value.json();

                            restrictedFields.forEach(z => {
                                transformedResponseBodyObj[z] = preserved[z];
                            });
                            value._body = JSON.stringify(transformedResponseBodyObj);
                            return value;
                        }
                        else {
                            value._body = handeler(value.text());
                            return value;
                        }
                    } else {
                        value._body = handeler(value.text());
                        return value;
                    }
                } else {
                    return value;
                }
            });

        }
        else if (data instanceof Array) {
            if (data.length > 1) {
                if (typeof data[0] === 'string') {

                }
                if (typeof data[1] === 'string' && /^[\[|\{](\s|.*|\w)*[\]|\}]$/gi.test(data[1])) {
                    let preserved: any = {};
                    let requestData: any = JSON.parse(data[1]);

                    if (Object.keys(requestData).some((x) => restrictedFields.some((y) => y === x))) {
                        restrictedFields.forEach(z => {
                            console.log(requestData[z]);
                            let existingDate = new Date(new Date(requestData[z].split('.')[0]).toLocaleString() + " UTC");
                            //moment(existingDate).format('YYYY-MM-DD');
                            preserved[z] = this.toJSONDate(existingDate);
                        });

                        let transformedData: any = JSON.parse(handeler(data[1]));

                        restrictedFields.forEach(z => {
                            transformedData[z] = preserved[z];
                        });

                        data[1] = JSON.stringify(transformedData);
                        return data;
                    } else {
                        data[1] = handeler(data[1]);
                        return data;
                    }
                }
                else
                    return data;
            } else
                return data;
        } else
            return data;
    }

    private static toJSONDate(date: Date): string {
        
        return `${this.pad(date.getFullYear().toString(),'0',4)}-${this.pad((date.getMonth() + 1).toString(),'0',2)}-${this.pad(date.getDate().toString(),'0',2)}T${this.pad(date.getHours().toString(),'0',2)}:${this.pad(date.getMinutes().toString(),'0',2)}:${this.pad(date.getSeconds().toString(),'0',2)}.000Z`;
    }

    private static pad(str: any, char: string, max: number): string {
        return str.toString().length < max ? this.pad(char + str, char, max) : str;
    }
}

