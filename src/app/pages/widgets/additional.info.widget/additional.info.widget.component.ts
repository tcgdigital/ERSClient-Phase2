import {
    Component, OnInit, Input,
    OnDestroy, OnChanges, SimpleChange,
    ViewEncapsulation
} from '@angular/core';

import { AdditionalInfoModel } from './additional.info.widget.model';
import { AdditionalInfoWidgetService } from './additional.info.widget.service';

@Component({
    selector: 'additional-info-widget',
    templateUrl: './additional.info.widget.view.html',
    styleUrls: ['./additional.info.widget.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdditionalInfoWidgetComponent implements OnInit, OnChanges, OnDestroy {
    @Input() currentIncidentId: number;
    public isShowAdditionalInfo: boolean = false;
    public additionalInfoModel: AdditionalInfoModel;
    constructor(private additionalInfoWidgetService: AdditionalInfoWidgetService) {
    }
    public ngOnInit() {
        this.additionalInfoModel = new AdditionalInfoModel();
        this.GetAdditionalInfoByIncident();
    }

    public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        if (changes['currentIncidentId'] !== undefined &&
            (changes['currentIncidentId'].currentValue !==
                changes['currentIncidentId'].previousValue) &&
            changes['currentIncidentId'].previousValue !== undefined) {
            this.GetAdditionalInfoByIncident();
        }
    }

    public ngOnDestroy(): void {

    }

    private GetAdditionalInfoByIncident() {
        this.additionalInfoWidgetService.GetAdditionalInfoByIncident(this.currentIncidentId, (InfoModel: AdditionalInfoModel) => {
            this.additionalInfoModel = InfoModel;
            if (this.additionalInfoModel.EmergencyCategory.toLowerCase() == 'flightrelated') {
                this.isShowAdditionalInfo = true;
            }
            else {
                this.isShowAdditionalInfo = false;
            }
            //console.log(this.additionalInfoModel);
        });
    }
}