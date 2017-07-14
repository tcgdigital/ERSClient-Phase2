import { Component, ViewEncapsulation, AfterContentInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { UtilityService } from '../../../shared/services/common.service';

@Component({
    selector: 'affectedobject-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/affected.objects.view.html',
    styleUrls: ['./styles/affected.objects.style.scss']
})
export class AffectedObjectsComponent implements AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngAfterContentInit(): void {
        this.subTabs = UtilityService.GetSubTabs('AffectedCargo');
    }

    
}