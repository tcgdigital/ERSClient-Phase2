import {
    Component, Input, ElementRef,
    Output, EventEmitter, OnInit, AfterContentInit
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import OData from 'odata-filter-builder';

import { SearchConfigModel, SearchControlType } from './search.config.model';
import { GenericSearchService } from './generic.search.service';

@Component({
    selector: 'generic-search',
    templateUrl: './generic.search.view.html',
    providers: [GenericSearchService],
    styles: [`
        .search-container {
            background: #eee;
            position: relative;
        }
        
        .search-block {
            width: 200px;
            display: inline-block;
            margin: 5px;
        }
        .search-block input[type="text"],
        .search-block select{
            padding: 4px;
            height: 33px;
        }

        .button-block {
            width: 85px !important;
        }

        .search-block label {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            display: block;
            font-size: 14px;
            margin-bottom: 2px;
            margin-left: 3px;
        }
    `]
})
export class GenericSearchComponent implements OnInit, AfterContentInit {
    @Input() filterConfigs: SearchConfigModel<any>[] = [];
    @Input() showReset: boolean = true;
    @Output('InvokeSearch') invokeSearch: EventEmitter<string> = new EventEmitter<string>();
    @Output('InvokeReset') invokeReset: EventEmitter<any> = new EventEmitter();

    controlType: any = SearchControlType;
    form: FormGroup;
    filterQuery: string = '';

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

    private generateFilterQuery(): string {
        let query: string = '';

        if (this.filterConfigs.length > 0) {
            let odata = OData();

            this.filterConfigs.forEach((x: SearchConfigModel<any>) => {
                if (this.form.controls[x.Name].value) {
                    switch (x.Type) {
                        case SearchControlType.TEXTBOX: {
                            odata.startsWith(y => y.toLower(x.Name),
                                this.form.controls[x.Name].value);
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