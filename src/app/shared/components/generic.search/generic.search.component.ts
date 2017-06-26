import {
    Component, Input, ElementRef, ViewEncapsulation,
    Output, EventEmitter, OnInit, AfterContentInit
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import OData from 'odata-filter-builder';

import { SearchConfigModel, SearchControlType } from './search.config.model';
import { GenericSearchService } from './generic.search.service';

@Component({
    selector: 'generic-search',
    templateUrl: './generic.search.view.html',
    encapsulation: ViewEncapsulation.None,
    providers: [GenericSearchService],
    styleUrls: ['./generic.search.style.scss']
})
export class GenericSearchComponent implements OnInit, AfterContentInit {
    @Input() filterConfigs: SearchConfigModel<any>[] = [];
    @Input() showReset: boolean = true;
    @Output('InvokeSearch') invokeSearch: EventEmitter<string> = new EventEmitter<string>();
    @Output('InvokeReset') invokeReset: EventEmitter<any> = new EventEmitter();

    controlType: any = SearchControlType;
    form: FormGroup;
    filterQuery: string = '';
    expandSearch: boolean = false;
    searchValue: string = "Expand Search";

    constructor(private elementRef: ElementRef,
        private searchService: GenericSearchService) { }

    ngAfterContentInit(): void {
        this.form = this.searchService.toFormGroup(this.filterConfigs);
    }

    ngOnInit(): void {
    }

    doSearch(): void {
        let searchQuery = this.generateFilterQuery();
        this.invokeSearch.emit(searchQuery);
    }

    doReset(): void {
        let defaultValue = {};
        this.filterConfigs.forEach(x => {
            defaultValue[x.Name] = (x.Value || '');
        });
        this.form.reset(defaultValue);
        this.invokeReset.emit();
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

    private generateFilterQuery(): string {
        let query: string = '';

        if (this.filterConfigs.length > 0) {
            let odata = OData();

            this.filterConfigs.forEach((x: SearchConfigModel<any>) => {
                if (this.form.controls[x.Name].value) {
                    switch (x.Type) {
                        case SearchControlType.TEXTBOX: {
                            if (x.OrCommand) {
                                let orCommandFields: string[] = x.OrCommand.split('|');
                                if (orCommandFields.length > 0) {
                                    let orConditions: OData[];
                                    orCommandFields.forEach((z: string) => {
                                        let orCondition: OData = (new OData())
                                            .contains(y => y.toLower(z),
                                            this.form.controls[x.Name].value);
                                        odata.or(orCondition);
                                    });
                                }
                            }
                            if (x.AndCommand) {
                                let andCommandFields: string[] = x.AndCommand.split('|');
                                if (andCommandFields.length > 0) {
                                    let andConditions: OData[];
                                    andCommandFields.forEach((z: string) => {
                                        let andCondition: OData = (new OData())
                                            .contains(y => y.toLower(z),
                                            this.form.controls[x.Name].value);
                                        odata.and(andCondition);
                                    });
                                }
                            }
                            if (!x.OrCommand && !x.AndCommand) {
                                odata.contains(y => y.toLower(x.Name),
                                    this.form.controls[x.Name].value);
                            }
                            break;
                        }
                        case SearchControlType.DATEPICKER:
                        case SearchControlType.DATETIMEPICKER:
                        case SearchControlType.DROPDOWN: {
                            let value = this.form.controls[x.Name].value;
                            if (value.match(/^\d+$/gi))
                                odata.eq(x.Name, +this.form.controls[x.Name].value);
                            else
                                odata.eq(x.Name, this.form.controls[x.Name].value);
                            break;
                        }
                    }
                }
            });
            query = odata.toString();
        }
        return query;
    }
}