import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { SearchConfigModel, SearchControlType } from './search.config.model';

@Injectable()
export class GenericSearchService {
    toFormGroup(searchConfigs: SearchConfigModel<any>[]) {
        let group: any = {};
        
        searchConfigs.forEach(config => {
            group[config.Name] = new FormControl(config.Value || '');
        });
        return new FormGroup(group);
    }
}