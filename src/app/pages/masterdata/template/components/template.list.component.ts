import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { TemplateModel } from './template.model';
import { TemplateService } from './template.service';
import { Observable } from 'rxjs/Rx';
import { EmergencySituationService } from '../../emergency.situation';
import {
    ResponseModel, DataExchangeService,
    GlobalConstants, UtilityService,
    SearchTextBox, SearchDropdown,
    NameValue, SearchConfigModel
} from '../../../../shared';

@Component({
    selector: 'template-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/template.list.view.html',
    styleUrls: ['../styles/template.style.scss']
})
export class TemplateListComponent implements OnInit, OnDestroy {
    vari: any = null;
    templates: TemplateModel[] = [];
    searchConfigs: SearchConfigModel<any>[] = [];
    templateModelPatch: TemplateModel = null;
    date: Date = new Date();
    templateMediaTypes: any[] = GlobalConstants.TemplateMediaType;
    expandSearch: boolean = false;
    searchValue: string = "Expand Search";

    constructor(private templateService: TemplateService,
        private emergencySituationService: EmergencySituationService,
        private dataExchange: DataExchangeService<TemplateModel>) {
    }

    initiateQuickLinkModelPatch(): void {
        this.templateModelPatch = new TemplateModel();
        this.templateModelPatch.ActiveFlag = 'Active';
        this.templateModelPatch.CreatedBy = 1;
        this.templateModelPatch.CreatedOn = this.date;
    }

    getTemplates(): void {
        this.templateService.GetAll()
            .subscribe((response: ResponseModel<TemplateModel>) => {
                this.templates = response.Records;
            });
    }

    onTemplateSaveSuccess(data: TemplateModel): void {
        this.templates.unshift(data);
    }

    expandSearchPanel(value): void {
        if (!value) {
            this.searchValue = "Hide Search Panel";
        }
        else {
            this.searchValue = "Expand Search Panel";
        }
        this.expandSearch = !this.expandSearch;

    }

    ngOnInit(): void {
        this.getTemplates();
        this.initiateSearchConfigurations();
        //this.dataExchange.Subscribe("quickLinkModelSaved", 
        //model => this.onTemplateSaveSuccess(model));
    }

    ngOnDestroy(): void {
        //this.dataExchange.Unsubscribe("quickLinkModelSaved");
    }

    editQuickLink(editedQuickLink: TemplateModel): void {
        //this.dataExchange.Publish("quickLinkModelEdited", editedQuickLink);
    }

    IsActive(event: any, editedTemplate: TemplateModel): void {
        this.initiateQuickLinkModelPatch();
        this.templateModelPatch.TemplateId = editedTemplate.TemplateId;
        this.templateModelPatch.ActiveFlag = 'Active';
        if (!event.checked) {
            this.templateModelPatch.ActiveFlag = 'InActive';
        }
        this.templateService.Update(this.templateModelPatch)
            .subscribe((response: TemplateModel) => {
                this.getTemplates();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }
    invokeSearch(query: string): void {
        if (query !== '') {
            this.templateService.GetQuery(query.replace(/(\'\|)/ig, ''))
                .subscribe((response: ResponseModel<TemplateModel>) => {
                    this.templates = response.Records;
                }, ((error: any) => {
                    console.log(`Error: ${error}`);
                }));
        }
    }
    invokeReset(): void {
        this.getTemplates();
    }
    getMediaName(id: number): string {
        if (id > 0) {
            return this.templateMediaTypes.find(x => x.Key == id).Value;
        }
        return "";
    }
    private initiateSearchConfigurations(): void {
        let mediatype: NameValue<string>[] = GlobalConstants.TemplateMediaType
            .map(x => new NameValue<string>(x.value, `|CMS.DataModel.Enum.TemplateMediaType'${x.value}'|`));

        this.searchConfigs = [
            new SearchDropdown({
                Name: 'TemplateMediaId',
                Description: 'Template Media',
                PlaceHolder: 'Select Template Media',
                Value: '',
                ListData: Observable.of(mediatype)
            }),
            new SearchDropdown({
                Name: 'EmergencySituationId',
                Description: 'Situation',
                PlaceHolder: 'Select Situation',
                Value: '',
                ListData: this.emergencySituationService.GetAll()
                    .map(x => x.Records)
                    .map(x => x.map(y => new NameValue<number>(y.EmergencySituationName, y.EmergencySituationId)))
            })
        ];
    }
}