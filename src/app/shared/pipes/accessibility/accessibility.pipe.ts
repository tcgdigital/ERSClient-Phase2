import { Pipe, PipeTransform } from '@angular/core';
import { GlobalConstants, UtilityService, GlobalStateService, KeyValue } from '../../../shared';

@Pipe({
    name: 'accesibility'
})
export class AccessibilityPipe implements PipeTransform {
    transform(value: any, departmentId:number, pageCode:string): any {
        return UtilityService.GetNecessaryPageLevelPermissionValidation(departmentId, pageCode);
    }
}