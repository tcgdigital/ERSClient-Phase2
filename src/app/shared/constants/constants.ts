
export class GlobalConstants {
    public static EXTERNAL_URL: string = 'http://localhost:5001/';
    public static CLIENT_ID: string = 'A924D89F487E4F888EA8CFDB1AE4E9D3';
    public static GRANT_TYPE: string = 'password';
    public static ODATA: string = 'odata';
    public static API: string = 'api';
    public static TOKEN: string = 'token';
    public static BATCH: string = 'odata/$batch'
    public static ACCESS_TOKEN: string = 'access_token';
    public static EmergencyCategories: Object = [
        { value: "FlightRelated", key: 1 },
        { value: "NonFlightRelated", key: 2 }
    ];
    public static ActiveFlag: Object = [{ value: "Active", key: 0 }, { value: "InActive", key: 1 }];
    public static EnquiryType: Object = [
        {
            value: "1",
            caption: "Passenger",
            text: "Passenger related"
        },
        {
            value: "2",
            caption: "Cargo",
            text: "Cargo related"
        },
        {
            value: "3",
            caption: 'Media',
            text: "Media related",
        },
        {
            value: "4",
            caption: 'Others',
            text: "Others",
        },
        {
            value: "5",
            caption: 'Crew',
            text: "Crew",
        }];
}

export enum DataModels {
    DEPARTMENT = <any>'departments',
}

export const LayoutSizes = {
    resWidthCollapseSidebar: 1200,
    resWidthHideSidebar: 500
};

export const WEBREQUEST = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
}

export const IMAGES_ROOT = 'assets/images/';

export const LayoutPaths = {
    images: {
        root: IMAGES_ROOT,
        profile: IMAGES_ROOT + 'app/profile/'
        // amMap: 'assets/img/theme/vendor/ammap/',
        // amChart: 'assets/img/theme/vendor/amcharts/dist/amcharts/images/'
    }
};

export const layoutSizes = {
    resWidthCollapseSidebar: 1200,
    resWidthHideSidebar: 500
};

export const isMobile = () =>
    (/android|webos|iphone|ipad|ipod|blackberry|windows phone/)
        .test(navigator.userAgent.toLowerCase());