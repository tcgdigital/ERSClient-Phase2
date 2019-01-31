import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { TemplateModel } from './template.model';
import { TemplateService } from './template.service';
import { Subject, Observable } from 'rxjs/Rx';
import { EmergencySituationService } from '../../emergency.situation';
import {
    ResponseModel, DataExchangeService,
    GlobalConstants, SearchDropdown,
    NameValue, SearchConfigModel, UtilityService
} from '../../../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'template-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/template.list.view.html',
    styleUrls: ['../styles/template.style.scss']
})
export class TemplateListComponent implements OnInit, OnDestroy {
    @ViewChild('childModal') public childModal: ModalDirective;
    vari: any = null;
    templates: TemplateModel[] = [];
    searchConfigs: SearchConfigModel<any>[] = [];
    templateModelPatch: TemplateModel = null;
    date: Date = new Date();
    templateMediaTypes: any[] = GlobalConstants.TemplateMediaType;
    expandSearch: boolean = false;
    searchValue: string = "Expand Search";
    private ngUnsubscribe: Subject<any> = new Subject<any>();
    templateEdit: TemplateModel = new TemplateModel();
    public isShow: boolean=true;
    currentDepartmentId: number;

    constructor(private templateService: TemplateService,
        private emergencySituationService: EmergencySituationService,
        private dataExchange: DataExchangeService<TemplateModel>,) {
    }

    initiateQuickLinkModelPatch(): void {
        this.templateModelPatch = new TemplateModel();
        this.templateModelPatch.ActiveFlag = 'Active';
        this.templateModelPatch.CreatedBy = 1;
        this.templateModelPatch.CreatedOn = this.date;
    }

    getTemplates(): void {
        this.templateService.GeAllEmailTemplates()
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<TemplateModel>) => {
                this.templates = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
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
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.TemplateOnEdited,
            (model: TemplateModel) => this.onTemplateModifiedSuccess(model));
    }

    public onTemplateModifiedSuccess(data: TemplateModel): void{
       if(this.templates.length>0)
       {
           let modifiedTemplate=this.templates.find(x=>x.TemplateId==data.TemplateId);
           if(modifiedTemplate != null && modifiedTemplate != undefined)
           {
               modifiedTemplate=data;
           }
       }
        this.initiateSearchConfigurations();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
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
                console.log(`Error: ${error.message}`);
            });
    }

    invokeSearch(query: string): void {
        if (query !== '') {
            this.templateService.GetQuery(query.replace(/(\'\|)/ig, ''))
                // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
                .takeUntil(this.ngUnsubscribe)
                .subscribe((response: ResponseModel<TemplateModel>) => {
                    this.templates = response.Records.filter(a => a.ActiveFlag == 'Active');
                }, ((error: any) => {
                    console.log(`Error: ${error.message}`);
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

    openTemplateDetail(editedTemplate: TemplateModel): void {
        this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.TemplateOnEditing, editedTemplate);
    }
}