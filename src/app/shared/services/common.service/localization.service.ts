import * as moment from 'moment/moment';
import { Observable } from 'rxjs/Rx';

export class LocalizationService {

    public static toLocal(date: Date): Date {
        let convertedDate = date.setMinutes(-(new Date()).getTimezoneOffset());
        return new Date(convertedDate); // Pleasde check



    }

    public static toUTC(date: Date): Date {
        let convertedDate = date.setMinutes((new Date()).getTimezoneOffset());
        return new Date(convertedDate); // Pleasde check
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

    public static transformRequestBody(request: any): any {
        if (request.text() !== null && request.text() !== undefined) {
            request._body.replace(/(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d{3}))?/mgi, (mached) => {
                let existingDate = new Date(mached);
                return moment(LocalizationService.toUTC(existingDate)).toJSON();
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

    public static transformResponseBody(response: any): any {
        if (response.text() !== null && response.text() !== undefined) {
            response._body = response.text()
                .replace(/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|[zZ]))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|[zZ]))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|[zZ]))/mgi, (mached) => {
                    let existingDate = new Date(mached);
                    return moment(LocalizationService.toLocal(existingDate)).toJSON();
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
                    let preserved: {};
                    if (restrictedFields.length > 0) {
                        let responseObject: {} = value.json();
                        if (Object.keys(responseObject).some((x) => restrictedFields.some((y) => y === x))) {
                            restrictedFields.forEach(z => {
                                preserved[z] = responseObject[z];
                            });
                            let transformedData: any = handeler(value);
                            let transformedResponseBodyObj: any = transformedData.json();


                            restrictedFields.forEach(z => {
                                transformedResponseBodyObj[z] = preserved[z];
                            });
                            transformedData._body = JSON.stringify(transformedResponseBodyObj);
                            return transformedData;
                        }
                        else {
                            return handeler(value);
                        }
                    } else {
                        return handeler(value);
                    }
                } else {
                    return value;
                }
            });

        }
        else if (data instanceof Array) {
            if (data.length > 0) {
                
                if (typeof data[1] === 'string' && /^[\[|\{](\s|.*|\w)*[\]|\}]$/gi.test(data[1])) {
                    let preserved: {};
                    let requestObject: {} = JSON.parse(data[1]);

                    if (Object.keys(requestObject).some((x) => restrictedFields.some((y) => y === x))) {
                        restrictedFields.forEach(z => {
                            preserved[z] = requestObject[z];
                        });

                        let transformedData: any = handeler(requestObject);

                        restrictedFields.forEach(z => {
                            transformedData[z] = preserved[z];
                        });

                        data[1] = JSON.stringify(transformedData);
                        return data;
                    } else {
                        let transformedData: any = handeler(requestObject);
                        data[1] = JSON.stringify(transformedData);
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
}