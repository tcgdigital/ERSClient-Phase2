
export class GlobalConstants {
    public static EXTERNAL_URL: string = 'http://172.20.23.110:84/';
    public static CLIENT_ID: string = 'A924D89F487E4F888EA8CFDB1AE4E9D3';
    public static GRANT_TYPE: string = 'password';
    public static ODATA: string = 'odata';
    public static API: string = 'api';
    public static TOKEN: string = 'token';
    public static BATCH: string = 'odata/$batch'
    public static ACCESS_TOKEN: string = 'access_token';
}

export enum DataModels {
    DEPARTMENT = <any>'departments',
}

export const LayoutSizes = {
    resWidthCollapseSidebar: 1200,
    resWidthHideSidebar: 500
};

export const WEBREQUEST ={
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