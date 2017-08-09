import { URLSearchParams } from '@angular/http';
import { FormGroup } from '@angular/forms';
import { KeyValue, BaseModel, LicenseInformationModel } from '../../models';
import * as jwtDecode from 'jwt-decode';
import { GlobalConstants, StorageType } from '../../constants';
import { AuthModel } from '../../models';
import * as moment from 'moment/moment';
import { RAGScaleModel } from '../../../pages/shared.components';
import { Observable } from 'rxjs/Rx';
import { PagesPermissionMatrixModel } from '../../../pages/masterdata/page.functionality/components/page.functionality.model';
import * as LZString from 'lz-string';

import {
    DemandRaisedModel,
    AllDeptDemandRaisedSummary,
    SubDeptDemandRaisedSummary
} from '../../../pages/widgets/demand.raised.summary.widget';
import {

    DemandReceivedModel,
    AllDeptDemandReceivedSummary,
    SubDeptDemandReceivedSummary
} from '../../../pages/widgets/demand.received.summary.widget';
import { ITabLinkInterface } from '../../components/tab.control';
import { Router } from "@angular/router/router";

export class UtilityService {
    public static RAGScaleData: RAGScaleModel[] = [];
    public static licenseInfo: LicenseInformationModel;
    private static STRIP_COMMENTS: RegExp = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    private static ARGUMENT_NAMES: RegExp = /([^\s,]+)/g;
    private static CACHE_PROPERTY: string = '__paramNames';

    public static IsEmptyObject = (obj: {}): boolean => Object.keys(obj).length === 0 && obj.constructor === Object;
    public static isShowPage: boolean = false;
    public static pagePermissionMatrix: PagesPermissionMatrixModel[] = [];
    public static IsEmptyArray = (obj: any[]): boolean => obj.length > 0 && obj[0] !== null;

    public static GetKeyValues(obj: any): KeyValue[] {
        const keyValues: KeyValue[] = [];
        Object.keys(obj).forEach((key) => {
            keyValues.push({ Key: key, Value: obj[key] });
        });
        return keyValues;
    }
    public static pluck<T, K extends keyof T>(o: T, names: K[]): Array<T[K]> {
        return names.map((n) => o[n]);
    }

    public static getCredentialDetails(): AuthModel {
        const access_token = this.GetFromSession(GlobalConstants.ACCESS_TOKEN);
        return jwtDecode(access_token);
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
        const params = new URLSearchParams();
        for (const key in data) {
            if (data.hasOwnProperty(key) && typeof key !== 'function') {
                params.set(key, data[key]);
            }
        }
        return params.toString();
    }

    public static SetToSession(data: {},
        storage: StorageType = StorageType.SessionStorage,
        doCompression: boolean = false): void {
        for (const key in data) {
            if (data.hasOwnProperty(key) && typeof key !== 'function') {
                const storageValue = doCompression ?
                    LZString.compressToUTF16(JSON.stringify(data[key] as string)) : data[key] as string;
                if (storage === StorageType.SessionStorage)
                    sessionStorage.setItem(key, storageValue);
                else
                    localStorage.setItem(key, storageValue);
            }
        }
    }

    public static GetFromSession(key: string, storage:
        StorageType = StorageType.SessionStorage,
        doDeCompression: boolean = false): string {
        if (this.IsSessionKeyExists(key, storage)) {
            if (storage === StorageType.SessionStorage)
                return doDeCompression ?
                    LZString.decompressFromUTF16(sessionStorage.getItem(key)) :
                    sessionStorage.getItem(key);
            else
                return doDeCompression ?
                    LZString.decompressFromUTF16(localStorage.getItem(key)) :
                    localStorage.getItem(key);
        }
        return '';
    }

    public static RemoveFromSession(key: string,
        storage: StorageType = StorageType.SessionStorage): void {
        if (this.IsSessionKeyExists(key, storage)) {
            if (storage === StorageType.SessionStorage)
                sessionStorage.removeItem(key);
            else
                localStorage.removeItem(key);
        }
    }

    public static IsSessionKeyExists(key: string,
        storage: StorageType = StorageType.SessionStorage): boolean {
        const keys: string[] = this.listAllSessionItems(storage);
        return (keys.some((x: string) => x === key));
    }

    // public static JsonToStorate(key: string, data: any): void {
    //     if (data) {
    //         const stringJson = JSON.stringify(data);
    //         const compressedJson = LZString.compressToUTF16(stringJson);
    //         this.SetToSession({ key: compressedJson });
    //     }
    // }

    // public static StorateToJson(key: string): any {
    //     const compressedJson = this.GetFromSession(key);
    //     if (compressedJson !== '') {
    //         const decompressedJson = LZString.decompressFromUTF16(compressedJson);
    //         return JSON.parse(decompressedJson);
    //     } else {
    //         return null;
    //     }
    // }

    public static shade(color, weight) {
        return UtilityService.mix('#000000', color, weight);
    }

    public static tint(color, weight) {
        return UtilityService.mix('#ffffff', color, weight);
    }

    public static mix(color1, color2, weight) {
        const d2h = (d) => d.toString(16);
        const h2d = (h) => parseInt(h, 16);

        let result = '#';
        for (let i = 1; i < 7; i += 2) {
            const color1Part = h2d(color1.substr(i, 2));
            const color2Part = h2d(color2.substr(i, 2));
            const resultPart = d2h(Math.floor(color2Part + (color1Part - color2Part) * (weight / 100.0)));
            result += ('0' + resultPart).slice(-2);
        }
        return result;
    }

    public static UUID(): string {
        if (typeof (window) !== 'undefined' && typeof (window.crypto) !== 'undefined' && typeof (window.crypto.getRandomValues) !== 'undefined') {
            const buf: Uint16Array = new Uint16Array(8);
            window.crypto.getRandomValues(buf);
            return (this.pad4(buf[0]) + this.pad4(buf[1]) + '-' + this.pad4(buf[2]) + '-' + this.pad4(buf[3]) + '-' + this.pad4(buf[4]) + '-' + this.pad4(buf[5]) + this.pad4(buf[6]) + this.pad4(buf[7]));
        } else {
            return this.random4() + this.random4() + '-' + this.random4() + '-' + this.random4() + '-' +
                this.random4() + '-' + this.random4() + this.random4() + this.random4();
        }
    }

    /**
     * Given a function, obtain it's name
     * Example: console.log('function name: ', reflection.nameOf(function hello() { }));
     * @static
     * @param {Function} func
     * @returns {string}
     *
     * @memberOf UtilityService
     */
    public static nameOf(func: Function): string {
        return func instanceof Function ? func['name'] : null;
    }

    /**
     * Given a function, obtain a list of argument names
     * Example: console.log(UtilityService.getParamNames((baz, bam) => baz + bam)); // => [ 'baz', 'bam' ]
     * @static
     * @param {Function} func
     * @returns {string[]}
     *
     * @memberOf UtilityService
     */
    public static getParamNames(func: Function): string[] {
        if (!func[UtilityService.CACHE_PROPERTY]) {
            const fnStr = func.toString().replace(UtilityService.STRIP_COMMENTS, '');
            func[UtilityService.CACHE_PROPERTY] = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
                .match(UtilityService.ARGUMENT_NAMES) || [];
        }

        return func[UtilityService.CACHE_PROPERTY];
    }

    public static getReturnType(func: Function): string {
        const fnStr = func.toString().replace(UtilityService.STRIP_COMMENTS, '');
        const props = fnStr.slice(fnStr.indexOf('{') + 1, fnStr.indexOf('}'))
            .match(UtilityService.ARGUMENT_NAMES) || [];

        const pattern = new RegExp(/\.(.*?)\;/gi);
        func[UtilityService.CACHE_PROPERTY] = props
            .filter((x: string) => pattern.test(x))
            .map((x: string) => {
                const prop = /\.(.*?)\;/gi.exec(x);
                return prop[1];
            });
        return func[UtilityService.CACHE_PROPERTY];
    }

    /**
     * Given an arbitrary function, and an argument factory function, dispatch the arbitrary function
     * Example: console.log(UtilityService.dispatch((baz, bam) => baz + bam,(name) => name + '!')); // => 'baz!bam!'
     * @static
     * @param {Function} func
     * @param {{ [name: string]: any }} factory
     *
     * @memberOf UtilityService
     */
    public static dispatch(func: Function, factory: { [name: string]: any });
    /**
     * Given an arbitrary function, and a map of argument names/values, dispatch the arbitrary function
     * Example: console.log(UtilityService.dispatch((baz, bam) => baz + bam, { baz: 'wop!', bam: 'bam!' })); // => 'baz!bam!'
     * @static
     * @param {Function} func
     * @param {{ (name: string): any }} factory
     *
     * @memberOf UtilityService
     */
    public static dispatch(func: Function, factory: { (name: string): any });

    public static dispatch(func: Function, factory: any) {
        const params = [];

        UtilityService.getParamNames(func).forEach((name) => params.push(
            factory instanceof Function ? factory(name) : factory[name]));

        return func.apply(null, params);
    }

    public static setModelFromFormGroup<T extends BaseModel>
        (entity: T, fromGroup: FormGroup, ...params: Array<(entity: T) => any>): void {
        const paramNames: string[] = [];
        if (params.length > 0) {
            params.forEach((x: Function) => {
                paramNames.push(UtilityService.getReturnType(x)[0]);
            });

            if (paramNames.length > 0) {
                paramNames.forEach((x: string) => {
                    entity[x] = fromGroup.controls[x].value;
                });
            }
        }
    }

    public static formDirtyCheck<T extends BaseModel>(entity: T, fromGroup: FormGroup, ...params: Array<(entity: T) => any>): void {
        const paramNames: string[] = [];
        if (params.length > 0) {
            params.forEach((x: Function) => {
                paramNames.push(UtilityService.getReturnType(x)[0]);
            });

            if (paramNames.length > 0) {
                paramNames.forEach((x: string) => {
                    if (fromGroup.controls[x].touched) {
                        entity[x] = fromGroup.controls[x].value;
                    }
                });
            }
        }
    }

    public static hexToRgbA(hex, alpha) {
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

    public static textToDate(dateString: string): Date {
        // let dateString = '2010-08-09 01:02:03';
        const reggie: RegExp = new RegExp('(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})');
        const dateArray: RegExpExecArray = reggie.exec(dateString);
        const dateObject = new Date(
            (+dateArray[1]),
            (+dateArray[2]) - 1, // Careful, month starts at 0!
            (+dateArray[3]),
            (+dateArray[4]),
            (+dateArray[5]),
            (+dateArray[6])
        );

        return dateObject;
    }

    public static SetRAGStatus<T extends any>(dataModels: T[], appliedModule: string): void {
        const RAGScale: RAGScaleModel[] = UtilityService.RAGScaleData.filter((item: RAGScaleModel) => {
            return item.AppliedModule === appliedModule;
        }).sort((a: any, b: any) => {
            if (a.StartingPoint < b.StartingPoint) return -1;
            if (a.StartingPoint > b.StartingPoint) return 1;
            return 0;
        });

        Observable.interval(1000).subscribe((_) => {
            dataModels.forEach((entity: any) => {
                let scheduleClose: number;
                let actualClose: number;

                if (entity.constructor.name === 'AllDeptDemandRaisedSummary' ||
                    entity.constructor.name === 'AllDeptDemandReceivedSummary' ||
                    entity.constructor.name === 'DemandModelToView') {
                    scheduleClose = (Number(entity.ScheduleTime) * 60000);
                    actualClose = new Date(entity.CreatedOn).getTime();
                }

                const currentTime: number = new Date().getTime();
                const timeDiffofCurrentMinus: number = (currentTime - actualClose);
                const percentage: number = (((timeDiffofCurrentMinus) * 100) / (scheduleClose));

                const selectedRag: RAGScaleModel = RAGScale.find((x: RAGScaleModel) => x.StartingPoint <= percentage
                    && ((x.EndingPoint === undefined || x.EndingPoint == null) ? percentage : x.EndingPoint) >= percentage);

                if (selectedRag) {
                    entity[Object.keys(entity).find((x) => x.startsWith('Rag'))] = selectedRag.StyleCode;
                }
            });
        });
    }

    public static SetRAGStatusGrid<T extends any>(dataModels: T[], appliedModule: string): void {

        const RAGScale: RAGScaleModel[] = UtilityService.RAGScaleData.filter((item: RAGScaleModel) => {
            return item.AppliedModule === appliedModule;
        }).sort((a: any, b: any) => {
            if (a.StartingPoint < b.StartingPoint) return -1;
            if (a.StartingPoint > b.StartingPoint) return 1;
            return 0;
        });
        dataModels.forEach((entity: any) => {

            const ScheduleTime: number = (Number(entity.ScheduleTime) * 60000);
            const CreatedOn: number = new Date(entity.CreatedOn).getTime();
            const CurrentTime: number = new Date().getTime();
            const TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
            const percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));

            const selectedRag: RAGScaleModel = RAGScale.find((x: RAGScaleModel) => x.StartingPoint <= percentage
                && ((x.EndingPoint === undefined || x.EndingPoint == null) ? percentage : x.EndingPoint) >= percentage);

            if (selectedRag) {
                entity[Object.keys(entity).find((x) => x.startsWith('Rag'))] = selectedRag.StyleCode;
            }
        });
    }

    public static GetRAGStatus(appliedModule: string, assignDate?: Date, scheduleClose?: Date): string {
        // TODO:  RAG code should come from database.
        const RAGScale: RAGScaleModel[] = UtilityService.RAGScaleData.filter((item: RAGScaleModel) => {
            return item.AppliedModule === appliedModule;
        }).sort((a: any, b: any) => {
            if (a.StartingPoint < b.StartingPoint) return -1;
            if (a.StartingPoint > b.StartingPoint) return 1;
            return 0;
        });

        if (assignDate !== undefined && scheduleClose !== undefined) {
            const startPoint: number = (new Date(assignDate)).getTime();
            const closedPoint: number = (new Date(scheduleClose)).getTime();
            let workPercentage: number = 0;
            let datetimenow: Date = null;
            datetimenow = new Date();
            const currentPoint: number = datetimenow.getTime();
            const workingSpan: number = closedPoint - startPoint;
            if (workingSpan > 0) {
                /// this span is the reference to the 100%.
                const currentWorkingSpan: number = currentPoint - startPoint;
                if (currentWorkingSpan < 0)
                    workPercentage = 0;
                else if (currentWorkingSpan > workingSpan)
                    workPercentage = 101;
                else
                    workPercentage = (currentWorkingSpan * 100) / workingSpan;

                const selectedRag: RAGScaleModel = RAGScale.find((x: RAGScaleModel) => x.StartingPoint <= workPercentage
                    && ((x.EndingPoint === undefined || x.EndingPoint == null) ? workPercentage : x.EndingPoint) >= workPercentage);
                return selectedRag.StyleCode;
            }
        }
    }

    public static GetNecessaryPageLevelPermissionValidation(departmentId: number, pageCode: string): boolean {
        this.isShowPage = false;
        this.pagePermissionMatrix = GlobalConstants.PagePermissionMatrix;


        const pagePermission: PagesPermissionMatrixModel[]
            = this.pagePermissionMatrix.filter((item: PagesPermissionMatrixModel) => {
                return (item.PageCode === pageCode && item.DepartmentId === departmentId);
            });

        if (pagePermission.length === 0) {
            this.isShowPage = false;
        }
        else if (pagePermission.length > 0) {
            if (pagePermission[0].CanView === false) {
                this.isShowPage = false;
            }
            else {
                this.isShowPage = true;
            }
        }
        return this.isShowPage;
    }

    public static FormatString(template: string, ...values: any[]): string {
        if (!values || !values.length || !template) {
            return template;
        }
        return this.toFormattedString(false, template, values);
    }


    public static SelectFirstTab(tabs: ITabLinkInterface[], router: Router): void {
        if (tabs.length > 0) {
            tabs.map((item: ITabLinkInterface, index: number) => {
                item.selected = (index === 0);
                // item.selected=false;
            });
            const firstTab = tabs[0];
            // firstTab.selected = true;
            if (firstTab.subtab != undefined) {
                if (firstTab.subtab.length > 0) {

                    firstTab.subtab[0].selected = true;
                    router.navigate([`${firstTab.url}${firstTab.subtab[0].url.replace('./', '/')}`]);
                }
                else {
                    router.navigate([`${firstTab.url}`]);
                }
            }
            else {
                router.navigate([`${firstTab.url}`]);
            }
        }
    }
    public static GetDashboardSubTabs(parentTabName: string): ITabLinkInterface[] {
        const departmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        let subTabs: ITabLinkInterface[];
        const rootTab: PagesPermissionMatrixModel = GlobalConstants.PagePermissionMatrix
            .find((x: PagesPermissionMatrixModel) => x.PageCode === parentTabName
                && x.Type === 'Tab' && x.DepartmentId === departmentId && x.CanView);

        if (rootTab) {
            const tabs: string[] = GlobalConstants.PagePermissionMatrix
                .filter((x: PagesPermissionMatrixModel) => x.ParentPageId === rootTab.PageId
                    && x.DepartmentId === departmentId && x.CanView)
                .map((x) => x.PageCode);

            if (tabs.length > 0) {
                subTabs = GlobalConstants.DashboardTabLinks.find((y: ITabLinkInterface) => y.id === parentTabName)
                    .subtab.filter((x: ITabLinkInterface) => tabs.some((y) => y === x.id));
            }
        }
        else {
            subTabs = [];
        }
        return subTabs;
    }
    public static GetArchieveDashboardSubTabs(parentTabName: string): ITabLinkInterface[] {
        const departmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        let subTabs: ITabLinkInterface[];
        const rootTab: PagesPermissionMatrixModel = GlobalConstants.PagePermissionMatrix
            .find((x: PagesPermissionMatrixModel) => x.PageCode === parentTabName
                && x.Type === 'Tab' && x.DepartmentId === departmentId && x.CanView);

        if (rootTab) {
            const tabs: string[] = GlobalConstants.PagePermissionMatrix
                .filter((x: PagesPermissionMatrixModel) => x.ParentPageId === rootTab.PageId
                    && x.DepartmentId === departmentId && x.CanView)
                .map((x) => x.PageCode);

            if (tabs.length > 0) {
                subTabs = GlobalConstants.ArchieveDashboardTabLinks.find((y: ITabLinkInterface) => y.id === parentTabName)
                    .subtab.filter((x: ITabLinkInterface) => tabs.some((y) => y === x.id));
            }
        }
        else {
            subTabs = [];
        }
        return subTabs;
    }

    private static pad4(num: number): string {
        let ret: string = num.toString(16);
        while (ret.length < 4) {
            ret = '0' + ret;
        }
        return ret;
    }

    private static random4(): string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    private static listAllSessionItems(storage: StorageType = StorageType.SessionStorage): string[] {
        const keys: string[] = new Array<string>();
        for (let i = 0; i <= ((storage === StorageType.SessionStorage) ?
            (sessionStorage.length - 1) : (localStorage.length - 1)); i++) {
            keys.push(sessionStorage.key(i));
        }
        return keys;
    }

    private static toFormattedString(useLocale: boolean, format: string, ...values: any[]): string {
        let result: string = '';
        for (let i = 0; ;) {
            // Find the next opening or closing brace
            const open: number = format.indexOf('{', i);
            const close: number = format.indexOf('}', i);
            if ((open < 0) && (close < 0)) {
                // Not found: copy the end of the string and break
                result += format.slice(i);
                break;
            }
            if ((close > 0) && ((close < open) || (open < 0))) {
                if (format.charAt(close + 1) !== '}') {
                    throw new Error('format stringFormatBraceMismatch');
                }
                result += format.slice(i, close + 1);
                i = close + 2;
                continue;
            }
            // Copy the string before the brace
            result += format.slice(i, open);
            i = open + 1;
            // Check for double braces (which display as one and are not arguments)
            if (format.charAt(i) === '{') {
                result += '{';
                i++;
                continue;
            }
            if (close < 0) throw new Error('format stringFormatBraceMismatch');
            // Find the closing brace
            // Get the string between the braces, and split it around the ':' (if any)
            const brace: string = format.substring(i, close);
            const colonIndex: number = brace.indexOf(':');
            const argNumber: number = parseInt((colonIndex < 0) ? brace : brace.substring(0, colonIndex), 10);
            if (isNaN(argNumber)) throw new Error('format stringFormatInvalid');
            const argFormat = (colonIndex < 0) ? '' : brace.substring(colonIndex + 1);
            let arg = values[argNumber];
            if (typeof (arg) === 'undefined' || arg === null) {
                arg = '';
            }
            // If it has a toFormattedString method, call it.  Otherwise, call toString()
            if (arg.toFormattedString) {
                result += arg.toFormattedString(argFormat);
            } else if (useLocale && arg.localeFormat) {
                result += arg.localeFormat(argFormat);
            } else if (arg.format) {
                result += arg.format(argFormat);
            } else
                result += arg.toString();
            i = close + 1;
        }
        return result;
    }
}

