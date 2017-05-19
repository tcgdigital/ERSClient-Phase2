import * as moment from 'moment/moment';
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
    }


    public static PreserveDateFromConversion(restrictedFields: string[], data: any, handeler: (data: any) => any): any {
        if (data !== null && data !== undefined) {
            let preserved: {};
            if (restrictedFields.length > 0) {
                if (Object.keys(data).some((x) => restrictedFields.some((y) => y === x))) {
                    restrictedFields.forEach(z => {
                        preserved[z] = data[z];
                    });
                    let transformedData: any = handeler(data);
                    restrictedFields.forEach(z => {
                        transformedData[z] = preserved[z];
                    });
                    return transformedData;
                }
            } else {
                return handeler(data);
            }
        } else {
            return data;
        }
    }
}